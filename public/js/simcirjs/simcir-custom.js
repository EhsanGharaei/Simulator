/**
 * Created by ehsangharaei on 02/11/2016.
 */
var createUIForPowerLine = function() {

    device.$ui.attr('class', 'simcir-device');
    device.$ui.on('deviceSelect', function() {
        if (selected) {
            addClass($(this), 'simcir-device-selected');
        } else {
            removeClass($(this), 'simcir-device-selected');
        }
    });

    var $body = createSVGElement('rect').
    attr('class', 'simcir-device-body').
    attr('rx', 2).attr('ry', 2);
    device.$ui.prepend($body);

    var $label = createLabel(label).
    attr('class', 'simcir-device-label').
    attr('text-anchor', 'middle');
    device.$ui.on('deviceLabelChange', function() {
        $label.text(getLabel() );
    });

    var label_dblClickHandler = function() {
        // open library,
        event.preventDefault();
        event.stopPropagation();
        var title = 'Enter device name ';
        var $labelEditor = $('<input type="text"/>').
        addClass('simcir-label-editor').
        val($label.text() ).
        on('keydown', function(event) {
            if (event.keyCode == 13) {
                // ENTER
                setLabel($(this).val() );
                $dlg.remove();
            } else if (event.keyCode == 27) {
                // ESC
                $dlg.remove();
            }
        } );
        var $placeHolder = $('<div></div>').
        append($labelEditor);
        var $dlg = showDialog(title, $placeHolder);
        $labelEditor.focus();
    };
    device.$ui.on('deviceAdd', function() {
        $label.on('dblclick', label_dblClickHandler);
    } );
    device.$ui.on('deviceRemove', function() {
        $label.off('dblclick', label_dblClickHandler);
    } );
    device.$ui.append($label);

    layoutUI();

};
