// See [[mw:CiteBook Tooltips]]
// Source https://en.wikipedia.org/wiki/MediaWiki:Gadget-CiteBookTooltips.js

/*eslint space-in-parens: ["error", "always"], array-bracket-spacing: ["error", "always"]*/

( function () {

// If you're loading the script from another wiki and want to set your settings, do that in `window`
// properties with `cbt_` prefix, e.g.
//   window.cbt_REF_LINK_SELECTOR = '...';
// They will be used instead of enwiki detaults.
    var REF_LINK_SELECTOR = window.cbt_REF_LINK_SELECTOR || '.reference, a[href^="#CITEREF"]',
        COMMENTED_TEXT_CLASS = window.cbt_COMMENTED_TEXT_CLASS || 'cbt-commentedText',
        COMMENTED_TEXT_SELECTOR = (
            window.cbt_COMMENTED_TEXT_SELECTOR ||
            ( COMMENTED_TEXT_CLASS ? '.' + COMMENTED_TEXT_CLASS + ', ' : '' ) +
            'abbr[title]'
        );

    if ( mw.messages.get( 'cbt-settings' ) === null ) {
        mw.messages.set( {
            'cbt-settings': 'CiteBook Tooltips settings',
            'cbt-enable-footer': 'Enable CiteBook Tooltips',
            'cbt-settings-title': 'CiteBook Tooltips',
            'cbt-save': 'Save',
            'cbt-enable': 'Enable CiteBook Tooltips',
            'cbt-activationMethod': 'Show a tooltip when I\'m',
            'cbt-hovering': 'hovering a reference',
            'cbt-clicking': 'clicking a reference',
            'cbt-delay': 'Delay before the tooltip appears (in milliseconds)',
            'cbt-tooltipsForComments': 'Show the tooltip over <span title="Tooltip example" class="' + ( COMMENTED_TEXT_CLASS || 'cbt-commentedText' ) + '" style="border-bottom: 1px dotted; cursor: help;">text with a dotted underline</span> in CiteBook Tooltips style (allows to see such tooltips on devices with no mouse support)',
            'cbt-disabledNote': 'You can re-enable CiteBook Tooltips using a link in the footer of the page.',
            'cbt-done': 'Done',
            'cbt-enabled': 'CiteBook Tooltips are enabled'
        } );
    }

// "Global" variables
    var SECONDS_IN_A_DAY = 60 * 60 * 24,
        CLASSES = {
            FADE_IN_DOWN: 'cbt-fade-in-down',
            FADE_IN_UP: 'cbt-fade-in-up',
            FADE_OUT_DOWN: 'cbt-fade-out-down',
            FADE_OUT_UP: 'cbt-fade-out-up'
        },
        IS_TOUCHSCREEN = 'ontouchstart' in document.documentElement,
        // Quite a rough check for mobile browsers, a mix of what is advised at
        // https://stackoverflow.com/a/24600597 (sends to
        // https://developer.mozilla.org/en-US/docs/Browser_detection_using_the_user_agent)
        // and https://stackoverflow.com/a/14301832
        IS_MOBILE = /Mobi|Android/i.test( navigator.userAgent ) ||
            typeof window.orientation !== 'undefined',
        CLIENT_NAME = $.client.profile().name,
        settingsString, settings, enabled, delay, activatedByClick, tooltipsForComments, cursorWaitCss,
        windowManager, $teleportTarget,
        $body = $( document.body ),
        $window = $( window ),
        $overlay = $( '<div>' )
            .addClass( 'cbt-overlay' )
            .appendTo( $body );

// Can't use before https://phabricator.wikimedia.org/T369880 is resolved
// mw.loader.using( 'mediawiki.page.ready' ).then( function ( require ) {
// 	$teleportTarget = $( require( 'mediawiki.page.ready' ).teleportTarget );
// 	$overlay.appendTo( $teleportTarget );
// } );

    // cbt is a handler function that gets passed to mw:hook().add
    function cbt( $content ) {
        // Popups gadget
        if ( window.pg ) {
            return;
        }

        var teSelector,
            settingsDialogOpening = false;

        function setSettingsCookie() {
            mw.cookie.set(
                'settings',
                (
                    Number( enabled ) +
                    '|' +
                    delay +
                    '|' +
                    Number( activatedByClick ) +
                    '|' +
                    Number( tooltipsForComments )
                ),
                { path: '/', expires: 90 * SECONDS_IN_A_DAY, prefix: '' }
            );
        }

        function enableCbt() {
            enabled = true;
            setSettingsCookie();
            $( '.cbt-enableItem' ).remove();
            cbt( $content );
            mw.notify( mw.msg( 'cbt-enabled' ) );
        }

        function disableCbt() {
            $content.find( teSelector ).removeClass( 'cbt-commentedText' ).off( '.cbt' );
            $body.off( '.cbt' );
            $window.off( '.cbt' );
        }

        function addEnableLink() {
            // #footer-places – Vector
            // #f-list – Timeless, Monobook, Modern
            // parent of #footer li – Cologne Blue
            var $footer = $( '#footer-places, #f-list' );
            if ( !$footer.length ) {
                $footer = $( '#footer li' ).parent();
            }
            if ( !$footer.find( '.cbt-enableItem' ).length ) {
                $footer.append(
                    $( '<li>' )
                        .addClass( 'cbt-enableItem' )
                        .append(
                            $( '<a>' )
                                .text( mw.msg( 'cbt-enable-footer' ) )
                                .attr( 'href', '#' )
                                .click( function ( e ) {
                                    e.preventDefault();
                                    enableCbt();
                                } )
                        )
                );
            }
        }

        function TooltippedElement( $element ) {
            var events,
                te = this;

            function onStartEvent( e ) {
                var showRefArgs;

                if ( activatedByClick && te.type !== 'commentedText' && e.type !== 'contextmenu' ) {
                    e.preventDefault();
                }
                if ( !te.noRef ) {
                    showRefArgs = [ $( this ) ];
                    if ( te.type !== 'supRef' ) {
                        showRefArgs.push( e.pageX, e.pageY );
                    }
                    te.showRef.apply( te, showRefArgs );
                }
            }

            function onEndEvent() {
                if ( !te.noRef ) {
                    te.hideRef();
                }
            }

            if ( !$element ) {
                return;
            }

            // TooltippedElement.$element and TooltippedElement.$originalElement will be different when
            // the first is changed after its cloned version is hovered in a tooltip
            this.$element = $element;
            this.$originalElement = $element;
            if ( this.$element.is( REF_LINK_SELECTOR ) ) {
                if ( this.$element.prop( 'tagName' ) === 'SUP' ) {
                    this.type = 'supRef';
                } else {
                    this.type = 'harvardRef';
                }
            } else {
                this.type = 'commentedText';
                this.comment = this.$element.attr( 'title' );
                if ( !this.comment ) {
                    return;
                }
                this.$element.addClass( 'cbt-commentedText' );
            }

            if ( activatedByClick ) {
                events = {
                    'click.cbt': onStartEvent
                };
                // Adds an ability to see tooltips for links
                if (
                    this.type === 'commentedText' &&
                    ( this.$element.closest( 'a' ).length || this.$element.has( 'a' ).length )
                ) {
                    events[ 'contextmenu.cbt' ] = onStartEvent;
                }
            } else {
                events = {
                    'mouseenter.cbt': onStartEvent,
                    'mouseleave.cbt': onEndEvent
                };
            }

            this.$element.on( events );

            this.hideRef = function ( immediately ) {
                clearTimeout( te.showTimer );

                if ( this.type === 'commentedText' ) {
                    this.$element.attr( 'title', this.comment );
                }

                if ( this.tooltip && this.tooltip.isPresent ) {
                    if ( activatedByClick || immediately ) {
                        this.tooltip.hide();
                    } else {
                        this.hideTimer = setTimeout( function () {
                            te.tooltip.hide();
                        }, 200 );
                    }
                } else if ( this.$ref && this.$ref.hasClass( 'cbt-target' ) ) {
                    this.$ref.removeClass( 'cbt-target' );
                    if ( activatedByClick ) {
                        $body.off( 'click.cbt touchstart.cbt', this.onBodyClick );
                    }
                }
            };

            this.showRef = function ( $element, ePageX, ePageY ) {
                // Popups gadget
                if ( window.pg ) {
                    disableCbt();
                    return;
                }

                if ( this.tooltip && !this.tooltip.$content.length ) {
                    return;
                }

                var tooltipInitiallyPresent = this.tooltip && this.tooltip.isPresent;

                function reallyShow() {
                    var viewportTop, refOffsetTop, teHref;

                    if ( !te.$ref && !te.comment ) {
                        teHref = te.type === 'supRef' ?
                            te.$element.find( 'a' ).attr( 'href' ) :
                            te.$element.attr( 'href' ); // harvardRef
                        te.$ref = teHref &&
                            $( '#' + $.escapeSelector( teHref.slice( 1 ) ) );
                        if ( !te.$ref || !te.$ref.length || !te.$ref.text() ) {
                            te.noRef = true;
                            return;
                        }
                    }

                    if ( !tooltipInitiallyPresent && !te.comment ) {
                        viewportTop = $window.scrollTop();
                        refOffsetTop = te.$ref.offset().top;
                        if (
                            !activatedByClick &&
                            viewportTop < refOffsetTop &&
                            viewportTop + $window.height() > refOffsetTop + te.$ref.height() &&
                            // There can be gadgets/scripts that make references horizontally scrollable.
                            $window.width() > te.$ref.offset().left + te.$ref.width()
                        ) {
                            // Highlight the reference itself
                            te.$ref.addClass( 'cbt-target' );
                            return;
                        }
                    }

                    if ( !te.tooltip ) {
                        te.tooltip = new Tooltip( te );
                        if ( !te.tooltip.$content.length ) {
                            return;
                        }
                    }

                    // If this tooltip is called from inside another tooltip. We can't define it
                    // in the constructor since a ref can be cloned but have the same Tooltip object;
                    // so, Tooltip.parent is a floating value.
                    te.tooltip.parent = te.$element.closest( '.cbt-tooltip' ).data( 'tooltip' );
                    if ( te.tooltip.parent && te.tooltip.parent.disappearing ) {
                        return;
                    }

                    te.tooltip.show();

                    if ( tooltipInitiallyPresent ) {
                        if ( te.tooltip.$element.hasClass( 'cbt-tooltip-above' ) ) {
                            te.tooltip.$element.addClass( CLASSES.FADE_IN_DOWN );
                        } else {
                            te.tooltip.$element.addClass( CLASSES.FADE_IN_UP );
                        }
                        return;
                    }

                    te.tooltip.calculatePosition( ePageX, ePageY );

                    $window.on( 'resize.cbt', te.onWindowResize );
                }

                // We redefine this.$element here because e.target can be a reference link inside
                // a reference tooltip, not a link that was initially assigned to this.$element
                this.$element = $element;

                if ( this.type === 'commentedText' ) {
                    this.$element.attr( 'title', '' );
                }

                if ( activatedByClick ) {
                    if (
                        tooltipInitiallyPresent ||
                        ( this.$ref && this.$ref.hasClass( 'cbt-target' ) )
                    ) {
                        return;
                    } else {
                        setTimeout( function () {
                            $body.on( 'click.cbt touchstart.cbt', te.onBodyClick );
                        }, 0 );
                    }
                }

                if ( activatedByClick || tooltipInitiallyPresent ) {
                    reallyShow();
                } else {
                    this.showTimer = setTimeout( reallyShow, delay );
                }
            };

            this.onBodyClick = function ( e ) {
                if ( !te.tooltip && !( te.$ref && te.$ref.hasClass( 'cbt-target' ) ) ) {
                    return;
                }

                var $current = $( e.target );

                function contextMatchesParameter( parameter ) {
                    return this === parameter;
                }

                // The last condition is used to determine cases when a clicked tooltip is the current
                // element's tooltip or one of its descendants
                while (
                    $current.length &&
                    (
                        !$current.hasClass( 'cbt-tooltip' ) ||
                        !$current.data( 'tooltip' ) ||
                        !$current.data( 'tooltip' ).upToTopParent(
                            contextMatchesParameter, [ te.tooltip ],
                            true
                        )
                    )
                    ) {
                    $current = $current.parent();
                }
                if ( !$current.length ) {
                    te.hideRef();
                }
            };

            this.onWindowResize = function () {
                te.tooltip.calculatePosition();
            };
        }

        function Tooltip( te ) {
            function openSettingsDialog() {
                var settingsDialog, settingsWindow;

                if ( cursorWaitCss ) {
                    cursorWaitCss.disabled = true;
                }

                function SettingsDialog() {
                    SettingsDialog.parent.call( this );
                }
                OO.inheritClass( SettingsDialog, OO.ui.ProcessDialog );

                SettingsDialog.static.name = 'settingsDialog';
                SettingsDialog.static.title = mw.msg( 'cbt-settings-title' );
                SettingsDialog.static.actions = [
                    {
                        modes: 'main',
                        action: 'save',
                        label: mw.msg( 'cbt-save' ),
                        flags: [ 'primary', 'progressive' ]
                    },
                    {
                        modes: 'main',
                        flags: [ 'safe', 'close' ]
                    },
                    {
                        modes: 'disabled',
                        action: 'deactivated',
                        label: mw.msg( 'cbt-done' ),
                        flags: [ 'primary', 'progressive' ]
                    }
                ];

                SettingsDialog.prototype.initialize = function () {
                    var dialog = this;

                    SettingsDialog.parent.prototype.initialize.apply( this, arguments );

                    this.enableCheckbox = new OO.ui.CheckboxInputWidget( {
                        selected: true
                    } );
                    this.enableCheckbox.on( 'change', function ( selected ) {
                        dialog.activationMethodSelect.setDisabled( !selected );
                        dialog.delayInput.setDisabled( !selected || dialog.clickOption.isSelected() );
                        dialog.tooltipsForCommentsCheckbox.setDisabled( !selected );
                    } );
                    this.enableField = new OO.ui.FieldLayout( this.enableCheckbox, {
                        label: mw.msg( 'cbt-enable' ),
                        align: 'inline',
                        classes: [ 'cbt-enableField' ]
                    } );

                    this.hoverOption = new OO.ui.RadioOptionWidget( {
                        label: mw.msg( 'cbt-hovering' )
                    } );
                    this.clickOption = new OO.ui.RadioOptionWidget( {
                        label: mw.msg( 'cbt-clicking' )
                    } );
                    this.activationMethodSelect = new OO.ui.RadioSelectWidget( {
                        items: [ this.hoverOption, this.clickOption ]
                    } );
                    this.activationMethodSelect.selectItem(
                        activatedByClick ? this.clickOption : this.hoverOption
                    );
                    this.activationMethodSelect.on( 'choose', function ( item ) {
                        dialog.delayInput.setDisabled( item === dialog.clickOption );
                    } );
                    this.activationMethodField = new OO.ui.FieldLayout( this.activationMethodSelect, {
                        label: mw.msg( 'cbt-activationMethod' ),
                        align: 'top'
                    } );

                    this.delayInput = new OO.ui.NumberInputWidget( {
                        input: { value: delay },
                        step: 50,
                        min: 0,
                        max: 5000,
                        disabled: activatedByClick,
                        classes: [ 'cbt-numberInput' ]
                    } );
                    this.delayField = new OO.ui.FieldLayout( this.delayInput, {
                        label: mw.msg( 'cbt-delay' ),
                        align: 'top'
                    } );

                    this.tooltipsForCommentsCheckbox = new OO.ui.CheckboxInputWidget( {
                        selected: tooltipsForComments
                    } );
                    this.tooltipsForCommentsField = new OO.ui.FieldLayout(
                        this.tooltipsForCommentsCheckbox,
                        {
                            label: new OO.ui.HtmlSnippet( mw.msg( 'cbt-tooltipsForComments' ) ),
                            align: 'inline',
                            classes: [ 'cbt-tooltipsForCommentsField' ]
                        }
                    );
                    new TooltippedElement(
                        this.tooltipsForCommentsField.$element.find(
                            '.' + ( COMMENTED_TEXT_CLASS || 'cbt-commentedText' )
                        )
                    );

                    this.fieldset = new OO.ui.FieldsetLayout();
                    this.fieldset.addItems( [
                        this.enableField,
                        this.activationMethodField,
                        this.delayField,
                        this.tooltipsForCommentsField
                    ] );

                    this.panelSettings = new OO.ui.PanelLayout( {
                        padded: true,
                        expanded: false
                    } );
                    this.panelSettings.$element.append( this.fieldset.$element );

                    this.panelDisabled = new OO.ui.PanelLayout( {
                        padded: true,
                        expanded: false
                    } );
                    this.panelDisabled.$element.append(
                        $( '<table>' )
                            .addClass( 'cbt-disabledHelp' )
                            .append(
                                $( '<tr>' ).append(
                                    $( '<td>' ).append(
                                        $( '<img>' ).attr( 'src', 'https://upload.wikimedia.org/wikipedia/commons/c/c0/MediaWiki_footer_link_ltr.svg' )
                                    ),
                                    $( '<td>' )
                                        .addClass( 'cbt-disabledNote' )
                                        .text( mw.msg( 'cbt-disabledNote' ) )
                                )
                            )
                    );

                    this.stackLayout = new OO.ui.StackLayout( {
                        items: [ this.panelSettings, this.panelDisabled ]
                    } );

                    this.$body.append( this.stackLayout.$element );
                };

                SettingsDialog.prototype.getSetupProcess = function ( data ) {
                    return SettingsDialog.parent.prototype.getSetupProcess.call( this, data )
                        .next( function () {
                            this.stackLayout.setItem( this.panelSettings );
                            this.actions.setMode( 'main' );
                        }, this );
                };

                SettingsDialog.prototype.getActionProcess = function ( action ) {
                    var dialog = this;

                    if ( action === 'save' ) {
                        return new OO.ui.Process( function () {
                            var newDelay = Number( dialog.delayInput.getValue() );

                            enabled = dialog.enableCheckbox.isSelected();
                            if ( newDelay >= 0 && newDelay <= 5000 ) {
                                delay = newDelay;
                            }
                            activatedByClick = dialog.clickOption.isSelected();
                            tooltipsForComments = dialog.tooltipsForCommentsCheckbox.isSelected();

                            setSettingsCookie();

                            if ( enabled ) {
                                dialog.close();
                                disableCbt();
                                cbt( $content );
                            } else {
                                dialog.actions.setMode( 'disabled' );
                                dialog.stackLayout.setItem( dialog.panelDisabled );
                                disableCbt();
                                addEnableLink();
                            }
                        } );
                    } else if ( action === 'deactivated' ) {
                        dialog.close();
                    }
                    return SettingsDialog.parent.prototype.getActionProcess.call( this, action );
                };

                SettingsDialog.prototype.getBodyHeight = function () {
                    return this.stackLayout.getCurrentItem().$element.outerHeight( true );
                };

                tooltip.upToTopParent( function adjustRightAndHide() {
                    if ( this.isPresent ) {
                        if ( this.$element[ 0 ].style.right ) {
                            this.$element.css(
                                'right',
                                '+=' + ( window.innerWidth - $window.width() )
                            );
                        }
                        this.te.hideRef( true );
                    }
                } );

                if ( !windowManager ) {
                    windowManager = new OO.ui.WindowManager();
                    $body.append( windowManager.$element );
                }

                settingsDialog = new SettingsDialog();
                windowManager.addWindows( [ settingsDialog ] );
                settingsWindow = windowManager.openWindow( settingsDialog );
                settingsWindow.opened.then( function () {
                    settingsDialogOpening = false;
                } );
                settingsWindow.closed.then( function () {
                    windowManager.clearWindows();
                } );
            }

            var tooltip = this;

            // This variable can change: one tooltip can be called from a harvard-style reference link
            // that is put into different tooltips
            this.te = te;

            switch ( this.te.type ) {
                case 'supRef':
                    this.id = 'cbt-' + this.te.$originalElement.attr( 'id' );
                    this.$content = this.te.$ref
                        .contents()
                        .filter( function ( i ) {
                            var $this = $( this );
                            return (
                                this.nodeType === Node.TEXT_NODE ||
                                !(
                                    $this.is( '.mw-cite-backlink' ) ||
                                    (
                                        i === 0 &&
                                        // Template:Cnote, Template:Note
                                        ( $this.is( 'b' ) ||
                                            // Template:Note_label
                                            $this.is( 'a' ) &&
                                            $this.attr( 'href' ).indexOf( '#ref' ) === 0
                                        )
                                    )
                                )
                            );
                        } )
                        .clone( true );
                    break;
                case 'harvardRef':
                    this.id = 'cbt-' + this.te.$originalElement.closest( 'li' ).attr( 'id' );
                    this.$content = this.te.$ref
                        .clone( true )
                        .removeAttr( 'id' );
                    break;
                case 'commentedText':
                    this.id = 'cbt-' + String( Math.random() ).slice( 2 );
                    this.$content = $( document.createTextNode( this.te.comment ) );
                    break;
            }
            if ( !this.$content.length ) {
                return;
            }

            this.isInsideWindow = Boolean( this.te.$element.closest( '.oo-ui-window' ).length );

            this.$element = $( '<div>' )
                .addClass( 'cbt-tooltip' )
                .attr( 'id', this.id )
                .attr( 'role', 'tooltip' )
                .data( 'tooltip', this );

            $('<p>Arf arf arf!</p>').appendTo( this.$element );

            var $hoverArea = $( '<div>' )
                .addClass( 'cbt-hoverArea' )
                .appendTo( this.$element );


            var $scroll = $( '<div>' )
                .addClass( 'cbt-scroll' )
                .appendTo( $hoverArea );

            this.$content = this.$content
                .wrapAll( '<div>' )
                .parent()
                .addClass( 'cbt-content' )
                .addClass( 'mw-parser-output' )
                .appendTo( $scroll );

            if ( !activatedByClick ) {
                this.$element
                    .mouseenter( function () {
                        if ( !tooltip.disappearing ) {
                            tooltip.upToTopParent( function () {
                                this.show();
                            } );
                        }
                    } )
                    .mouseleave( function ( e ) {
                        // https://stackoverflow.com/q/47649442 workaround. Relying on relatedTarget
                        // alone has pitfalls: when alt-tabbing, relatedTarget is empty too
                        if (
                            CLIENT_NAME !== 'chrome' ||
                            (
                                !e.originalEvent ||
                                e.originalEvent.relatedTarget !== null ||
                                !tooltip.clickedTime ||
                                $.now() - tooltip.clickedTime > 50
                            )
                        ) {
                            tooltip.upToTopParent( function () {
                                this.te.hideRef();
                            } );
                        }
                    } )
                    .click( function () {
                        tooltip.clickedTime = $.now();
                    } );
            }

            if ( !this.isInsideWindow ) {
                $( '<a>' )
                    .addClass( 'cbt-settingsLink' )
                    .attr( 'role', 'button' )
                    .attr( 'href', '#' )
                    .attr( 'title', mw.msg( 'cbt-settings' ) )
                    .click( function ( e ) {
                        e.preventDefault();
                        if ( settingsDialogOpening ) {
                            return;
                        }
                        settingsDialogOpening = true;

                        if ( mw.loader.getState( 'oojs-ui' ) !== 'ready' ) {
                            if ( cursorWaitCss ) {
                                cursorWaitCss.disabled = false;
                            } else {
                                cursorWaitCss = mw.util.addCSS( 'body { cursor: wait; }' );
                            }
                        }
                        mw.loader.using( [ 'oojs', 'oojs-ui' ], openSettingsDialog );
                    } )
                    .prependTo( this.$content );
            }

            // Tooltip tail element is inside tooltip content element in order for the tooltip
            // not to disappear when the mouse is above the tail
            this.$tail = $( '<div>' )
                .addClass( 'cbt-tail' )
                .prependTo( this.$element );

            this.disappearing = false;

            this.show = function () {
                this.disappearing = false;
                clearTimeout( this.te.hideTimer );
                clearTimeout( this.te.removeTimer );

                this.$element
                    .removeClass( CLASSES.FADE_OUT_DOWN )
                    .removeClass( CLASSES.FADE_OUT_UP );

                if ( !this.isPresent ) {
                    $overlay.append( this.$element );
                }

                this.isPresent = true;
            };

            this.hide = function () {
                var tooltip = this;

                tooltip.disappearing = true;

                if ( tooltip.$element.hasClass( 'cbt-tooltip-above' ) ) {
                    tooltip.$element
                        .removeClass( CLASSES.FADE_IN_DOWN )
                        .addClass( CLASSES.FADE_OUT_UP );
                } else {
                    tooltip.$element
                        .removeClass( CLASSES.FADE_IN_UP )
                        .addClass( CLASSES.FADE_OUT_DOWN );
                }

                tooltip.te.removeTimer = setTimeout( function () {
                    if ( tooltip.isPresent ) {
                        tooltip.$element.detach();

                        tooltip.$tail.css( 'left', '' );

                        if ( activatedByClick ) {
                            $body.off( 'click.cbt touchstart.cbt', tooltip.te.onBodyClick );
                        }
                        $window.off( 'resize.cbt', tooltip.te.onWindowResize );

                        tooltip.isPresent = false;
                    }
                }, 200 );
            };

            this.calculatePosition = function ( ePageX, ePageY ) {
                var teElement, teOffsets, teOffset, targetTailOffsetX, tailLeft;

                this.$tail.css( 'left', '' );

                teElement = this.te.$element.get( 0 );
                if ( ePageX !== undefined ) {
                    targetTailOffsetX = ePageX;
                    teOffsets = ( teElement.getClientRects && teElement.getClientRects() ) ||
                        teElement.getBoundingClientRect();
                    if ( teOffsets.length > 1 ) {
                        for ( var i = teOffsets.length - 1; i >= 0; i-- ) {
                            if (
                                ePageY >= Math.round( $window.scrollTop() + teOffsets[ i ].top ) &&
                                ePageY <= Math.round(
                                    $window.scrollTop() + teOffsets[i].top + teOffsets[ i ].height
                                )
                            ) {
                                teOffset = teOffsets[ i ];
                            }
                        }
                    }
                }

                if ( !teOffset ) {
                    teOffset = ( teElement.getClientRects && teElement.getClientRects()[ 0 ] ) ||
                        teElement.getBoundingClientRect();
                }
                teOffset = {
                    top: $window.scrollTop() + teOffset.top,
                    left: $window.scrollLeft() + teOffset.left,
                    width: teOffset.width,
                    height: teOffset.height
                };
                if ( !targetTailOffsetX ) {
                    targetTailOffsetX = teOffset.left + ( teOffset.width / 2 );
                }

                // Value of `left` in `.cbt-tooltip-above .cbt-tail`
                var defaultTailLeft = 19;

                // Value of `width` in `.cbt-tail`
                var tailSideWidth = 13;

                // We tilt the square 45 degrees, so we need square root to calculate the distance.
                var tailWidth = tailSideWidth * Math.SQRT2;
                var tailHeight = tailWidth / 2;
                var tailCenterDelta = tailSideWidth + 1 - ( tailWidth / 2 );

                var tooltip = this;
                var getTop = function ( isBelow ) {
                    var delta = isBelow ?
                        teOffset.height + tailHeight :
                        -tooltip.$element.outerHeight() - tailHeight + 1;
                    return teOffset.top + delta;
                };

                this.$element.css( {
                    top: getTop(),
                    left: targetTailOffsetX - defaultTailLeft - tailCenterDelta,
                    right: ''
                } );

                // Is it squished against the right side of the page?
                if ( this.$element.offset().left + this.$element.outerWidth() > $window.width() - 1 ) {
                    this.$element.css( {
                        left: '',
                        right: 0
                    } );
                    tailLeft = targetTailOffsetX - this.$element.offset().left - tailCenterDelta;
                }

                // Is a part of it above the top of the screen?
                if ( teOffset.top < this.$element.outerHeight() + $window.scrollTop() + tailHeight ) {
                    this.$element
                        .removeClass( 'cbt-tooltip-above' )
                        .addClass( 'cbt-tooltip-below' )
                        .addClass( CLASSES.FADE_IN_UP )
                        .css( {
                            top: getTop( true )
                        } );
                    if ( tailLeft ) {
                        this.$tail.css( 'left', ( tailLeft + tailSideWidth ) + 'px' );
                    }
                } else {
                    this.$element
                        .removeClass( 'cbt-tooltip-below' )
                        .addClass( 'cbt-tooltip-above' )
                        .addClass( CLASSES.FADE_IN_DOWN )
                        // A fix for cases when a tooltip shown once is then wrongly positioned when it
                        // is shown again after a window resize.
                        .css( {
                            top: getTop()
                        } );
                    if ( tailLeft ) {
                        this.$tail.css( 'left', tailLeft + 'px' );
                    }
                }
            };

            // Run some function for all the tooltips up to the top one in a tree. Its context will be
            // the tooltip, while its parameters may be passed to Tooltip.upToTopParent as an array
            // in the second parameter. If the third parameter passed to ToolTip.upToTopParent is true,
            // the execution stops when the function in question returns true for the first time,
            // and ToolTip.upToTopParent returns true as well.
            this.upToTopParent = function ( func, parameters, stopAtTrue ) {
                var returnValue,
                    currentTooltip = this;

                do {
                    returnValue = func.apply( currentTooltip, parameters );
                    if ( stopAtTrue && returnValue ) {
                        break;
                    }
                } while ( ( currentTooltip = currentTooltip.parent ) );

                if ( stopAtTrue ) {
                    return returnValue;
                }
            };
        }

        if ( !enabled ) {
            addEnableLink();
            return;
        }

        teSelector = REF_LINK_SELECTOR;
        if ( tooltipsForComments ) {
            teSelector += ', ' + COMMENTED_TEXT_SELECTOR;
        }
        $content.find( teSelector ).each( function () {
            new TooltippedElement( $( this ) );
        } );
    }

    settingsString = mw.cookie.get( 'CBTsettings', '' );
    if ( settingsString ) {
        settings = settingsString.split( '|' );
        enabled = Boolean( Number( settings[ 0 ] ) );
        delay = Number( settings[ 1 ] );
        activatedByClick = Boolean( Number( settings[ 2 ] ) );
        // The forth value was added later, so we provide for a default value. See comments below
        // for why we use "IS_TOUCHSCREEN && IS_MOBILE".
        tooltipsForComments = settings[ 3 ] === undefined ?
            IS_TOUCHSCREEN && IS_MOBILE :
            Boolean( Number( settings[ 3 ] ) );
    } else {
        enabled = true;
        delay = 200;
        // Since the mobile browser check is error-prone, adding IS_MOBILE condition here would probably
        // leave cases where a user interacting with the browser using touches doesn't know how to call
        // a tooltip in order to switch to activation by click. Some touch-supporting laptop users
        // interacting by touch (though probably not the most popular use case) would not be happy too.
        activatedByClick = IS_TOUCHSCREEN;
        // Arguably we shouldn't convert native tooltips into gadget tooltips for devices that have
        // mouse support, even if they have touchscreens (there are laptops with touchscreens).
        // IS_TOUCHSCREEN check here is for reliability, since the mobile check is prone to false
        // positives.
        tooltipsForComments = IS_TOUCHSCREEN && IS_MOBILE;
    }

    mw.hook( 'wikipage.content' ).add( cbt );

}() );
