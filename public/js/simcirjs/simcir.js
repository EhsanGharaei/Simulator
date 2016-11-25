//
// SimcirJS
//
// Copyright (c) 2014 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//  http://www.opensource.org/licenses/mit-license.php
//

// includes following device types:
//  In
//  Out
/**
 * Base function of SimcirJS
 *
 * @class simcir
 */
var simcir = function($) {

  var newpowerLineLength=200;
  var powerLineVoltageLevel="HV";

  /**
   * It creates SVG element.
   * Input: tagNeme
   *
   * @method createSVGElement
   * @return {function} Returns $(document.createElementNS())
   */
  var createSVGElement = function(tagName) {
    return $(document.createElementNS(
        'http://www.w3.org/2000/svg', tagName) );
  };
  /**
   * It creates SVG.
   * Input: w,h
   *
   * @method createSVG
   * @return {function} Returns createSVGElement('svg').attr({})
   */
  var createSVG = function(w, h) {
    return createSVGElement('svg').attr({
      version: '1.1',
      width: w, height: h,
      viewBox: '0 0 ' + w + ' ' + h
    });
  };
  /**
   * It creates some functions for drawing.
   * Input: $target
   * @method graphics
   * @return {function} Returns attr,moveTo,lineTo,curveTo,closePath,drawRect,drawCircle
   */
  var graphics = function($target) {
    var attr = {};
    var buf = '';
    /**
     * It move pointer of starting drowing element.
     * Input: x, y
     *
     * @method moveTo
     * @return -
     */
    var moveTo = function(x, y) {
      buf += ' M ' + x + ' ' + y;
    };
    /**
     * It draw a line
     * Input: x, y
     *
     * @method lineTo
     * @return -
     */
    var lineTo = function(x, y) {
      buf += ' L ' + x + ' ' + y;
    };
    /**
     * It draw a curve
     * Input: x1, y1, x, y
     *
     * @method curveTo
     * @return -
     */
    var curveTo = function(x1, y1, x, y) {
      buf += ' Q ' + x1 + ' ' + y1 + ' ' + x + ' ' + y;
    };
    /**
     * It close path in a drawing
     * Input: boolean close
     *
     * @method closePath
     * @return -
     */
    var closePath = function(close) {
      if (close) {
        // really close path.
        buf += ' Z';
      }
      $target.append(createSVGElement('path').
          attr('d', buf).attr(attr) );
      buf = '';
    };
    /**
     * It draws rectangular
     * Input: x, y, width, height
     *
     * @method drawRect
     * @return -
     */
    var drawRect = function(x, y, width, height) {
      $target.append(createSVGElement('rect').
          attr({x: x, y: y, width: width, height: height}).attr(attr) );
    };
    /**
     * It draws circle
     * Input: x, y, r
     *
     * @method drawCircle
     * @return -
     */
    var drawCircle = function(x, y, r) {
      $target.append(createSVGElement('circle').
          attr({cx: x, cy: y, r: r}).attr(attr) );
    };
    return {
      attr: attr,
      moveTo: moveTo,
      lineTo: lineTo,
      curveTo: curveTo,
      closePath: closePath,
      drawRect: drawRect,
      drawCircle: drawCircle
    };
  };
  /**
   * split class names.
   * Input: $o,f
   * @method eachClass
   * @return {function} Returns callback on each classnames of an attribute
   */
  var eachClass = function($o, f) {
    var className = $o.attr('class');
    if (className) {
      $.each(className.split(/\s+/g), f);
    }
  };
  /**
   * add or remove class.
   * Input: $o,className, remove
   * @method addClass
   * @return {function} Returns $o
   */
  var addClass = function($o, className, remove) {
    var newClass = '';
    eachClass($o, function(i, c) {
      if (!(remove && c == className) ) {
        newClass += '\u0020';
        newClass += c;
      }
    });
    if (!remove) {
      newClass += '\u0020';
      newClass += className;
    }
    $o.attr('class', newClass);
    return $o;
  };
  /**
   * remove class.
   * Input: $o,classNeme
   * @method removeClass
   * @return {function} Returns addClass with remove true to remove a class
   */
  var removeClass = function($o, className) {
    return addClass($o, className, true);
  };
  /**
   * search to find if it has the className.
   * Input: $o,className
   * @method hasClass
   * @return {boolean} Returns true or false
   */
  var hasClass = function($o, className) {
    var found = false;
    eachClass($o, function(i, c) {
      if (c == className) {
        found = true;
      }
    });
    return found;
  };
  /**
   * move or rotate attribute.
   * Input: -
   * @method transform
   * @return {variables} Returns x,y,rotate
   */
  var transform = function() {
    var attrX = 'simcir-transform-x';
    var attrY = 'simcir-transform-y';
    var attrRotate = 'simcir-transform-rotate';
    /**
     * -
     * Input: $o, k
     *
     * @method num
     * @return {Integer} v? +v : 0
     */
    var num = function($o, k) {
      var v = $o.attr(k);
      return v? +v : 0;
    };
    return function($o, x, y, rotate) {
      if (arguments.length >= 3) {
        var transform = 'translate(' + x + ' ' + y + ')';
        if (rotate) {
          transform += ' rotate(' + rotate + ')';
        }
        $o.attr('transform', transform);
        $o.attr(attrX, x);
        $o.attr(attrY, y);
        $o.attr(attrRotate, rotate);
      } else if (arguments.length == 1) {
        return {x: num($o, attrX), y: num($o, attrY),
          rotate: num($o, attrRotate)};
      }
    };
  }();
  /**
   * offset an element.
   * Input: $o
   * @method offset
   * @return {variables} Returns x,y
   */
  var offset = function($o) {
    var x = 0;
    var y = 0;
    while ($o[0].nodeName != 'svg') {
      var pos = transform($o);
      x += pos.x;
      y += pos.y;
      $o = $o.parent();
    }
    return {x: x, y: y};
  };
  /**
   * set "pointer-events" css class value to "visiblePainted" if enable else 'none'.
   * Input: $o,enable
   * @method enableEvents
   * @return -
   */
  var enableEvents = function($o, enable) {
    $o.css('pointer-events', enable? 'visiblePainted' : 'none');
  };
  /**
   * set css '-webkit-user-select' value to 'none'.
   * Input: $o
   * @method disableSelection
   * @return -
   */
  var disableSelection = function($o) {
    $o.each(function() {
      this.onselectstart = function() { return false; };
    }).css('-webkit-user-select', 'none');
  };
  /**
   * ???????????
   * Input: -
   * @method controller
   * @return {function} ????
   */
  var controller = function() {
    var id = 'controller';
    return function($ui, controller) {
      if (arguments.length == 1) {
        return $.data($ui[0], id);
      } else if (arguments.length == 2) {
        $.data($ui[0], id, controller);
      }
    };
  }();
  /**
   * events handler.
   * Input: -
   * @method eventQueue
   * @return {function} postEvent
   */
  var eventQueue = function() {
    var delay = 50; // ms
    var limit = 40; // ms
    var _queue = null;
    /**
     * add event to events queue.
     * Input: event
     * @method postEvent
     * @return -
     */
    var postEvent = function(event) {
      if (_queue == null) {
        _queue = [];
      }
      _queue.push(event);
    };
    /**
     * dispatch event.
     * Input: -
     * @method dispatchEvent
     * @return -
     */
    var dispatchEvent = function() {
      var queue = _queue;
      _queue = null;
      while (queue.length > 0) {
        var e = queue.shift();
        e.target.trigger(e.type);
      }
    };
    /**
     * get current time.
     * Input: -
     * @method getTime
     * @return {Date} current time
     */
    var getTime = function() {
      return new Date().getTime();
    };
    /**
     * check events timing if it is expired remove from queue.
     * Input: -
     * @method timerHandler
     * @return -
     */
    var timerHandler = function() {
      var start = getTime();
      while (_queue != null && getTime() - start < limit) {
        dispatchEvent();
      }
      window.setTimeout(timerHandler,
        Math.max(delay - limit, delay - (getTime() - start) ) );
    };
    timerHandler();
    return {
      postEvent: postEvent
    };
  }();
  /**
   * @param {Integer} unit
   * it is set to 16
   *
   */
  var unit = 16;
  /**
   * @param {Integer} fontSize
   * it is set to 12
   *
   */
  var fontSize = 12;
  /**
   * create text label.
   * Input: text
   * @method createLabel
   * @return {function} Returns createSVGElement to make an text element.
   */
  var createLabel = function(text) {
    return createSVGElement('text').
      text(text).
      css('font-size', fontSize + 'px');
  };
  /**
   * creates node and its controller, input, output.
   * Input: type,label,description, headless
   * @method createNode
   * @return {element} Returns $node
   */
  var createNode = function(type, label, description, headless,device_def_type,device_num_of_inputs,currentInput) {
    var $node = createSVGElement('g').
      attr('simcir-node-type', type);
    if (!headless) {
      $node.attr('class', 'simcir-node');
    }
    var node = createNodeController({
      $ui: $node, type: type, label: label,
      description: description, headless: headless,device_def_type:device_def_type,device_num_of_inputs:device_num_of_inputs,currentInput:currentInput});
    if (type == 'in') {
      controller($node, createInputNodeController(node) );
    } else if (type == 'out') {
      controller($node, createOutputNodeController(node) );
    } else {
      throw 'unknown type:' + type;
    }
    return $node;
  };
  /**
   * checks if the node is active or not.
   * Input: $o
   * @method isActiveNode
   * @return {boolean} Returns true or false
   */
  var isActiveNode = function($o) {
    return $o.closest('.simcir-node').length == 1 &&
      $o.closest('.simcir-toolbox').length == 0;
  };
  /**
   * controls everything about a node, setvalue, post event, get value, append label,
   * add class, remove class, handel inputs and outputs.
   * Input: -
   * @method createNodeController
   * @return {function} $.extend() node with setValue, getValue
   */
  var createNodeController = function(node) {
    var _value = null;
    /**
     * set node value and post its event.
     * Input: value, force
     * @method setValue
     * @return -
     */
    var setValue = function(value, force) {
      if (_value === value && !force) {
        return;
      }
      _value = value;
      eventQueue.postEvent({target: node.$ui, type: 'nodeValueChange'});
    };
    /**
     * set node value.
     * Input: value, force
     * @method getValue
     * @return {value} value
     */
    var getValue = function() {
      return _value;
    };

    if (!node.headless) {

      node.$ui.attr('class', 'simcir-node simcir-node-type-' + node.type);
      //added by ehsangharaei
      if((node.device_def_type=='Power line (MV)'||node.device_def_type=='Power line (HV)'||node.device_def_type=='Power line (LV)') && node.device_num_of_inputs && node.device_num_of_inputs!='') {
        var dividedLength=newpowerLineLength/node.device_num_of_inputs;
        //var $circle = createSVGElement('circle').attr({cx: dividedLength*node.currentInput, cy: 16, r: 4});
        var $circle = createSVGElement('circle').attr({cx: 0, cy: 0, r: 4});
      }
      else{
        var $circle = createSVGElement('circle').attr({cx: 0, cy: 0, r: 4});
      }
      node.$ui.on('mouseover', function(event) {
        if (isActiveNode(node.$ui) ) {
          addClass(node.$ui, 'simcir-node-hover');
        }
      });
      node.$ui.on('mouseout', function(event) {
        if (isActiveNode(node.$ui) ) {
          removeClass(node.$ui, 'simcir-node-hover');
        }
      });
      node.$ui.append($circle);
      /**
       * set node label.
       * Input: text, align
       * @method appendLabel
       * @return -
       */
      var appendLabel = function(text, align) {
        var $label = createLabel(text).
          attr('class', 'simcir-node-label');
        enableEvents($label, false);
        if (align == 'right') {
          $label.attr('text-anchor', 'start').
            attr('x', 6).
            attr('y', fontSize / 2);
        } else if (align == 'left') {
          $label.attr('text-anchor', 'end').
            attr('x', -6).
            attr('y', fontSize / 2);
        }
        node.$ui.append($label);
      };
      if (node.label) {
        if (node.type == 'in') {
          appendLabel(node.label, 'right');
        } else if (node.type == 'out') {
          appendLabel(node.label, 'left');
        }
      }
      if (node.description) {
        if (node.type == 'in') {
          appendLabel(node.description, 'left');
        } else if (node.type == 'out') {
          appendLabel(node.description, 'right');
        }
      }
      node.$ui.on('nodeValueChange', function(event) {
        if (_value != null) {
          addClass(node.$ui, 'simcir-node-hot');
        } else {
          removeClass(node.$ui, 'simcir-node-hot');
        }
      });
    }

    return $.extend(node, {
      setValue: setValue,
      getValue: getValue
    });
  };
  /**
   * extend node with setoutput and getoutput.
   * Input: node
   * @method createInputNodeController
   * @return {function} $.extend(node, {setOutput,getOutput});
   */
  var createInputNodeController = function(node) {
    var output = null;
    var setOutput = function(outNode) {
      output = outNode;
    };
    /**
     * get output.
     * Input: -
     * @method getOutput
     * @return {output} output;
     */
    var getOutput = function() {
      return output;
    };
    return $.extend(node, {
      setOutput: setOutput,
      getOutput: getOutput
    });
  };
  /**
   * extend node with setValue, getInputs, connectTo, disconnectFrom.
   * Input: node
   * @method createOutputNodeController
   * @return {function} $.extend(node, {setValue, getInputs, connectTo, disconnectFrom});
   */
  var createOutputNodeController = function(node) {
    var inputs = [];
    var super_setValue = node.setValue;
    /**
     * set value of input node.
     * Input: value
     * @method setValue
     * @return -
     */
    var setValue = function(value) {
      super_setValue(value);
      $.each(inputs, function(i, inputNode) {
        inputNode.setValue(value);
      });
    };
    /**
     * connect 2 nodes.
     * Input: inNode
     * @method connectTo
     * @return -
     */
    var connectTo = function(inNode) {
      if (inNode.getOutput() != null) {
        inNode.getOutput().disconnectFrom(inNode);
      }
      inNode.setOutput(node);
      inputs.push(inNode);
      inNode.setValue(node.getValue(), true);
    };
    /**
     * disconnect 2 nodes.
     * Input: inNode
     * @method disconnectFrom
     * @return -
     */
    var disconnectFrom = function(inNode) {
      if (inNode.getOutput() != node) {
        throw 'not connected.';
      }
      inNode.setOutput(null);
      inNode.setValue(null, true);
      inputs = $.grep(inputs, function(v) {
        return v != inNode;
      });
    };
    /**
     * get inputs.
     * Input: -
     * @method getInputs
     * @return {input} input
     */
    var getInputs = function() {
      return inputs;
    };
    return $.extend(node, {
      setValue: setValue,
      getInputs: getInputs,
      connectTo: connectTo,
      disconnectFrom: disconnectFrom
    });
  };
  /**
   * creates device, add device controller.
   * Input: deviceDef, headless
   * @method createDevice
   * @return {element} $dev
   */
  var createDevice = function(deviceDef, headless) {
    headless = headless || false;
    var $dev = createSVGElement('g');
    if (!headless) {
      $dev.attr('class', 'simcir-device');
    }
    controller($dev, createDeviceController(
        {$ui: $dev, deviceDef: deviceDef,
          headless: headless, doc: null}) );
    var factory = factories[deviceDef.type];
    if (factory) {
      factory(controller($dev) );
    }
    if (!headless) {
      controller($dev).createUI();
    }
    return $dev;
  };
  /**
   * creates device controller.
   * Input: device
   * @method createDeviceController
   * @return {function} $.extend(device, {addInput,addOutput,getInputs,getOutputs,disconnectAll,setSelected,
      isSelected,getLabel,false,getSize,createUI,layoutUI});
   */
  var createDeviceController = function(device) {
    var inputs = [];
    var outputs = [];
    var device_def_type=device.deviceDef.type;
    var device_num_of_inputs=device.numOfInputs?device.numOfInputs:'';
    /**
     * add input node to a device.
     * Input: label, description,numOfInput,currentInput
     * @method addInput
     * @return {node} node
     */
    var addInput = function(label, description,numOfInput,currentInput) {
      var $node = createNode('in', label, description, device.headless,device_def_type,numOfInput,currentInput);

      $node.on('nodeValueChange', function(event) {
        device.$ui.trigger('inputValueChange');
      });
      if (!device.headless) {
        device.$ui.append($node);
      }
      var node = controller($node);
      inputs.push(node);
      return node;
    };
    /**
     * add output node to a device.
     * Input: label, description
     * @method addOutput
     * @return {node} node
     */
    var addOutput = function(label, description) {
      var $node = createNode('out', label, description, device.headless,device_def_type,'','');
      if (!device.headless) {
        device.$ui.append($node);
      }
      var node = controller($node);
      outputs.push(node);
      return node;
    };
    /**
     * get inputs of a device.
     * Input: -
     * @method getInputs
     * @return {array of node} inputs
     */
    var getInputs = function() {
      return inputs;
    };
    /**
     * get outputs of a device.
     * Input: -
     * @method getInputs
     * @return {array of node} outputs
     */
    var getOutputs = function() {
      return outputs;
    };
    /**
     * disconnect all ofthe inputs and outputs of a device.
     * Input: -
     * @method disconnectAll
     * @return -
     */
    var disconnectAll = function() {
      $.each(getInputs(), function(i, inNode) {
        var outNode = inNode.getOutput();
        if (outNode != null) {
          outNode.disconnectFrom(inNode);
        }
      });
      $.each(getOutputs(), function(i, outNode) {
        $.each(outNode.getInputs(), function(i, inNode) {
          outNode.disconnectFrom(inNode);
        });
      });
    };

    var selected = false;
    /**
     * set selected class for a device.
     * Input: value
     * @method setSelected
     * @return -
     */
    var setSelected = function(value) {
      selected = value;
      device.$ui.trigger('deviceSelect');
    };
    /**
     * check if device is selected or not.
     * Input: -
     * @method isSelected
     * @return {boolean}selected
     */
    var isSelected = function() {
      return selected;
    };

    var label = device.deviceDef.label;
    var defaultLabel = device.deviceDef.type;
    if (typeof label == 'undefined') {
      label = defaultLabel;
    }
    /**
     * set label for a device.
     * Input: value
     * @method setLabel
     * @return -
     */
    var setLabel = function(value) {
      value = value.replace(/^\s+|\s+$/g, '');
      label = value || defaultLabel;
      device.$ui.trigger('deviceLabelChange');
    };
    /**
     * get label of a device.
     * Input: -
     * @method getLabel
     * @return {String} label
     */
    var getLabel = function() {
      return label;
    };
    /**
     * get size of the device.
     * Input: -
     * @method getSize
     * @return {Object} width, height
     */
    var getSize = function() {
      var nodes = Math.max(device.getInputs().length,
          device.getOutputs().length);
      return { width: unit * 2,
        height: unit * Math.max(2, device.halfPitch?
            (nodes + 1) / 2 : nodes)};
    };
    /**
     * manage Layout UI of a device.
     * Input: -
     * @method layoutUI
     * @return -
     */
    var layoutUI = function() {

      var size = device.getSize();
      var w = size.width;
      var h = size.height;


      device.$ui.children('.simcir-device-body').
        attr({x: 0, y: 0, width: w, height: h});

      var pitch = device.halfPitch? unit / 2 : unit;
      /**
       * manage Layout UI of nodes of a device.
       * Input: nodes, x , type
       * @method layoutNodes
       * @return -
       */
      var layoutNodes = function(nodes, x , type) {
        var offset;
        if(type=='') {
          offset = (h - pitch * (nodes.length - 1) ) / 2;
          //added by ehsangharaei
          $.each(nodes, function (i, node) {
            transform(node.$ui, x, pitch * i + offset);
          });
        }
        if(type=='powerLineOutput') {
          offset = (h - pitch * (nodes.length - 1) ) / 2;
          //added by ehsangharaei
          $.each(nodes, function (i, node) {
            transform(node.$ui, x, 16);
          });
        }
        if(type=='powerLineInput'){
          offset = (h - pitch * (nodes.length - 1) ) / 2;
          //added by ehsangharaei
          var eachInputDistance=newpowerLineLength/nodes.length;
          $.each(nodes, function (i, node) {
            transform(node.$ui, i*eachInputDistance , pitch + offset);
          });
        }
      };


      if(device.deviceDef.type =='Power line (MV)'|| device.deviceDef.type =='Power line (HV)' || device.deviceDef.type =='Power line (LV)') {
        layoutNodes(getInputs(), 0, 'powerLineInput');
        layoutNodes(getOutputs(), newpowerLineLength, 'powerLineOutput');
      }
      else{
        layoutNodes(getInputs(), 0, '');
        layoutNodes(getOutputs(), w, '');
      }


      device.$ui.children('.simcir-device-label').
        attr({x: w / 2, y: h + fontSize});
    };
    /**
     * creates UI of a device and manage it.
     * Input: -
     * @method createUI
     * @return -
     */
    var createUI = function() {

      device.$ui.attr('class', 'simcir-device');
      device.$ui.on('deviceSelect', function() {
        if (selected) {
          addClass($(this), 'simcir-device-selected');
        } else {
          removeClass($(this), 'simcir-device-selected');
        }
      });
      //--------added by ehsangharaei-------------------

      if(device.deviceDef.type =='Power line (MV)' || device.deviceDef.type =='Power line (HV)' || device.deviceDef.type =='Power line (LV)') {
        var size = device.getSize();
        var w = size.width;
        var h = size.height;
        var powerLineLength = 200;

        if(device.deviceDef.type =='Power line (HV)')
          var $body = createSVGElement('path').attr('class', 'power-line-hv  simcir-device-body').attr('d', 'M '+0+' '+w/2+' L '+powerLineLength+' '+w/2 );
        else if(device.deviceDef.type =='Power line (MV)')
          var $body = createSVGElement('path').attr('class', 'power-line-mv  simcir-device-body').attr('d', 'M '+0+' '+w/2+' L '+powerLineLength+' '+w/2 );
        else if(device.deviceDef.type =='Power line (LV)')
          var $body = createSVGElement('path').attr('class', 'power-line-lv  simcir-device-body').attr('d', 'M '+0+' '+w/2+' L '+powerLineLength+' '+w/2 );

        var $icon = createSVGElement('image').attr('href', './public/images/flash.png').attr('height', 15).attr('width', 15).attr('x', -25).attr('y', 7);
      }
      else{
        var $body = createSVGElement('rect').attr('class', 'simcir-device-body').attr('rx', 2).attr('ry', 2);
        if(device.deviceDef.type =='Transformer')
          var $icon = createSVGElement('image').attr('href', './public/images/transformer.png').attr('height', 24).attr('width', 24).attr('x', 4).attr('y',4);
        if(device.deviceDef.type =='Nuclear power plant')
          var $icon = createSVGElement('image').attr('href', './public/images/nuclearPowerPlant.png').attr('height', 28).attr('width', 28).attr('x', 2).attr('y',2);
        if(device.deviceDef.type =='windmill')
          var $icon = createSVGElement('image').attr('href', './public/images/windmill.png').attr('height', 28).attr('width', 28).attr('x', 2).attr('y',2);

      }
      device.$ui.prepend($icon);
      device.$ui.prepend($body);


      if(device.deviceDef.type =='Power line (MV)' || device.deviceDef.type =='Power line (HV)' || device.deviceDef.type =='Power line (LV)') {
        //label=powerLineVoltageLevel;
        label=device.deviceDef.type.substr(12,2);
      }
      var $label = createLabel(label).attr('class', 'simcir-device-label').attr('text-anchor', 'middle');
      device.$ui.on('deviceLabelChange', function () {
        $label.text(getLabel());
      });

      /**
       * handles double click on label
       * Input: -
       * @method label_dblClickHandler
       * @return -
       */
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


    return $.extend(device, {
      addInput: addInput,
      addOutput: addOutput,
      getInputs: getInputs,
      getOutputs: getOutputs,
      disconnectAll: disconnectAll,
      setSelected: setSelected,
      isSelected: isSelected,
      getLabel: getLabel,
      halfPitch: false,
      getSize: getSize,
      createUI: createUI,
      createUIForPowerLine:createUIForPowerLine,
      layoutUI: layoutUI
    });
  };
  /**
   * creates connector.
   * Input: x1, y1, x2, y2
   * @method createConnector
   * @return {function} createSVGElement('path')
   */
  var createConnector = function(x1, y1, x2, y2) {
    return createSVGElement('path').
      attr('d', 'M ' + x1 + ' ' + y1 + ' L ' + x2 + ' ' + y2).
      attr('class', 'simcir-connector');
  };
  /**
   * creates connector.
   * Input: x1, y1, x2, y2
   * @method connect
   * @return -
   */
  var connect = function($node1, $node2) {
    var type1 = $node1.attr('simcir-node-type');
    var type2 = $node2.attr('simcir-node-type');
    if (type1 == 'in' && type2 == 'out') {
      controller($node2).connectTo(controller($node1) );
    } else if (type1 == 'out' && type2 == 'in') {
      controller($node1).connectTo(controller($node2) );
    }
  };
  /**
   * creates device element.
   * Input: data, headless
   * @method buildCircuit
   * @return {element} $devices
   */
  var buildCircuit = function(data, headless) {
    var $devices = [];
    var $devMap = {};
    /**
     * get input and output nodes of a device.
     * Input: path
     * @method getNode
     * @return {node} array of nodes
     */
    var getNode = function(path) {
      if (!path.match(/^(\w+)\.(in|out)([0-9]+)$/g) ) {
        throw 'unknown path:' + path;
      }
      var devId = RegExp.$1;
      var type = RegExp.$2;
      var index = +RegExp.$3;
      return (type == 'in')?
        controller($devMap[devId]).getInputs()[index] :
        controller($devMap[devId]).getOutputs()[index];
    };
    $.each(data.devices, function(i, deviceDef) {
      var $dev = createDevice(deviceDef, headless);
      transform($dev, deviceDef.x, deviceDef.y);
      $devices.push($dev);
      $devMap[deviceDef.id] = $dev;
    });
    $.each(data.connectors, function(i, conn) {
      var nodeFrom = getNode(conn.from);
      var nodeTo = getNode(conn.to);
      if (nodeFrom && nodeTo) {
        connect(nodeFrom.$ui, nodeTo.$ui);
      }
    });
    return $devices;
  };
  /**
   * creates dialog.
   * Input: title, $content
   * @method showDialog
   * @return {element} $dlg
   */
  var showDialog = function(title, $content) {
    var $closeButton = function() {
      var r = 16;
      var pad = 4;
      var $btn = createSVG(r, r).
        attr('class', 'simcir-dialog-close-button');
      var g = graphics($btn);
      g.drawRect(0, 0, r, r);
      g.attr['class'] = 'simcir-dialog-close-button-symbol';
      g.moveTo(pad, pad);
      g.lineTo(r - pad, r - pad);
      g.closePath();
      g.moveTo(r - pad, pad);
      g.lineTo(pad, r - pad);
      g.closePath();
      return $btn;
    }();
    var $title = $('<div></div>').
      addClass('simcir-dialog-title').
      text(title).
      css('cursor', 'default').
      on('mousedown', function(event) {
      event.preventDefault();
    });
    var $dlg = $('<div></div>').
      addClass('simcir-dialog').
      css({position:'absolute'}).
      append($title.css('float', 'left') ).
      append($closeButton.css('float', 'right') ).
      append($('<br/>').css('clear', 'both') ).
      append($content);
    $('BODY').append($dlg);
    var dragPoint = null;
    /**
     * dialog mouse down handler.
     * Input: event
     * @method dlg_mouseDownHandler
     * @return -
     */
    var dlg_mouseDownHandler = function(event) {
      if (!$(event.target).hasClass('simcir-dialog') &&
          !$(event.target).hasClass('simcir-dialog-title') ) {
        return;
      }
      event.preventDefault();
      $dlg.detach();
      $('BODY').append($dlg);
      var off = $dlg.offset();
      dragPoint = {
        x: event.pageX - off.left,
        y: event.pageY - off.top};
      $(document).on('mousemove', dlg_mouseMoveHandler);
      $(document).on('mouseup', dlg_mouseUpHandler);
    };
    /**
     * dialog mouse movements handler.
     * Input: event
     * @method dlg_mouseMoveHandler
     * @return -
     */
    var dlg_mouseMoveHandler = function(event) {
      moveTo(
          event.pageX - dragPoint.x,
          event.pageY - dragPoint.y);
    };
    /**
     * dialog mouse up handler.
     * Input: event
     * @method dlg_mouseUpHandler
     * @return -
     */
    var dlg_mouseUpHandler = function(event) {
      $(document).off('mousemove', dlg_mouseMoveHandler);
      $(document).off('mouseup', dlg_mouseUpHandler);
    };
    $dlg.on('mousedown', dlg_mouseDownHandler);
    $closeButton.on('mousedown', function() {
      $dlg.remove();
    });
    var w = $dlg.width();
    var h = $dlg.height();
    var cw = $(window).width();
    var ch = $(window).height();
    var x = (cw - w) / 2 + $(document).scrollLeft();
    var y = (ch - h) / 2 + $(document).scrollTop();
    var moveTo = function(x, y) {
      $dlg.css({left: x + 'px', top: y + 'px'});
    };
    moveTo(x, y);
    return $dlg;
  };
  /**
   *
   * Input: data
   * @method createDeviceRefFactory
   * @return {function}
   */
  var createDeviceRefFactory = function(data) {
    return function(device) {
      var $devs = buildCircuit(data, true);
      var $ports = [];
      $.each($devs, function(i, $dev) {
        var deviceDef = controller($dev).deviceDef;
        if (deviceDef.type == 'In' || deviceDef.type == 'Out') {
          $ports.push($dev);
        }
      });
      $ports.sort(function($p1, $p2) {
        var x1 = controller($p1).deviceDef.x;
        var y1 = controller($p1).deviceDef.y;
        var x2 = controller($p2).deviceDef.x;
        var y2 = controller($p2).deviceDef.y;
        if (x1 == x2) {
          return (y1 < y2)? -1 : 1;
        }
        return (x1 < x2)? -1 : 1;
      });
      /**
       * get port description.
       * Input: event
       * @method getDesc
       * @return {string} port.description
       */
      var getDesc = function(port) {
        return port? port.description : '';
      };
      $.each($ports, function(i, $port) {
        var port = controller($port);
        var portDef = port.deviceDef;
        var inPort;
        var outPort;
        if (portDef.type == 'In') {
          outPort = port.getOutputs()[0];
          inPort = device.addInput(portDef.label,
              getDesc(outPort.getInputs()[0]));
          // force disconnect test devices that connected to In-port
          var inNode = port.getInputs()[0];
          if (inNode.getOutput() != null) {
            inNode.getOutput().disconnectFrom(inNode);
          }
        } else if (portDef.type == 'Out') {
          inPort = port.getInputs()[0];
          outPort = device.addOutput(portDef.label,
              getDesc(inPort.getOutput() ) );
          // force disconnect test devices that connected to Out-port
          var outNode = port.getOutputs()[0];
          $.each(outNode.getInputs(), function(i, inNode) {
            if (inNode.getOutput() != null) {
              inNode.getOutput().disconnectFrom(inNode);
            }
          } );
        }
        inPort.$ui.on('nodeValueChange', function() {
          outPort.setValue(inPort.getValue() );
        });
      });
      var super_getSize = device.getSize;
      device.getSize = function() {
        var size = super_getSize();
        return {width: unit * 4, height: size.height};
      };
      device.$ui.on('dblclick', function(event) {
        // open library,
        event.preventDefault();
        event.stopPropagation();
        showDialog(device.deviceDef.label || device.deviceDef.type,
            setupSimcir($('<div></div>'), data) );
      });
    };
  };
  /**
   * @param {object} factories
   *
   *
   */
  var factories = {};
  /**
   * @param {array} defaultToolbox
   *
   *
   */
  var defaultToolbox = [];
  /**
   * Add device in toolbox and create device factory forthat device.
   * Input: type, factory
   * @method registerDevice
   * @return -
   */
  var registerDevice = function(type, factory) {
    if (typeof factory == 'object') {
      factory = createDeviceRefFactory(factory);
    }
    factories[type] = factory;
    if(type!='Power line (MV)' && type!='Power line (LV)' && type!='Power line (HV)')
      defaultToolbox.push({type: type});
  };
  /**
   * Create scroll bar and controls all of its actions.
   * Input: -
   * @method createScrollbar
   * @return {element} $scrollbar
   */
  var createScrollbar = function() {

    // vertical only.
    var _value = 0;
    var _min = 0;
    var _max = 0;
    var _barSize = 0;
    var _width = 0;
    var _height = 0;

    var $body = createSVGElement('rect');
    var $bar = createSVGElement('g').
      append(createSVGElement('rect') ).
      attr('class', 'simcir-scrollbar-bar');
    var $scrollbar = createSVGElement('g').
      attr('class', 'simcir-scrollbar').
      append($body).append($bar).
      on('unitup', function(event) {
        setValue(_value - unit * 2);
      }).on('unitdown', function(event) {
        setValue(_value + unit * 2);
      }).on('rollup', function(event) {
        setValue(_value - _barSize);
      }).on('rolldown', function(event) {
        setValue(_value + _barSize);
      });

    var dragPoint = null;
    /**
     * toolbox scroll bar mouse down handle.
     * Input: event
     * @method bar_mouseDownHandler
     * @return -
     */
    var bar_mouseDownHandler = function(event) {
      event.preventDefault();
      event.stopPropagation();
      var pos = transform($bar);
      dragPoint = {
          x: event.pageX - pos.x,
          y: event.pageY - pos.y};
      $(document).on('mousemove', bar_mouseMoveHandler);
      $(document).on('mouseup', bar_mouseUpHandler);
    };
    /**
     * toolbox scroll bar mouse movement handle.
     * Input: event
     * @method bar_mouseMoveHandler
     * @return -
     */
    var bar_mouseMoveHandler = function(event) {
      calc(function(unitSize) {
        setValue( (event.pageY - dragPoint.y) / unitSize);
      });
    };
    /**
     * toolbox scroll bar mouse up handle.
     * Input: event
     * @method bar_mouseUpHandler
     * @return -
     */
    var bar_mouseUpHandler = function(event) {
      $(document).off('mousemove', bar_mouseMoveHandler);
      $(document).off('mouseup', bar_mouseUpHandler);
    };
    $bar.on('mousedown', bar_mouseDownHandler);
    /**
     * simulate body mouse down handle.
     * Input: event
     * @method body_mouseDownHandler
     * @return -
     */
    var body_mouseDownHandler = function(event) {
      event.preventDefault();
      event.stopPropagation();
      var off = $scrollbar.parents('svg').offset();
      var pos = transform($scrollbar);
      var y = event.pageY - off.top - pos.y;
      var barPos = transform($bar);
      if (y < barPos.y) {
        $scrollbar.trigger('rollup');
      } else {
        $scrollbar.trigger('rolldown');
      }
    };
    $body.on('mousedown', body_mouseDownHandler);
    /**
     * set size of the simulator.
     * Input: width, height
     * @method setSize
     * @return -
     */
    var setSize = function(width, height) {
      _width = width;
      _height = height;
      layout();
    };
    /**
     * make simulator body layout.
     * Input: -
     * @method layout
     * @return -
     */
    var layout = function() {

      $body.attr({x: 0, y: 0, width: _width, height: _height});

      var visible = _max - _min > _barSize;
      $bar.css('display', visible? 'inline' : 'none');
      if (!visible) {
        return;
      }
      calc(function(unitSize) {
        $bar.children('rect').
          attr({x: 0, y: 0, width: _width, height: _barSize * unitSize});
        transform($bar, 0, _value * unitSize);
      });
    };
    /**
     *
     * Input: f
     * @method calc
     * @return -
     */
    var calc = function(f) {
      f(_height / (_max - _min) );
    };
    /**
     *
     * Input: value
     * @method setValue
     * @return -
     */
    var setValue = function(value) {
      setValues(value, _min, _max, _barSize);
    };
    /**
     * set values for making layout of toolbox and scroll bar
     * Input: value, min, max, barSize
     * @method setValues
     * @return -
     */
    var setValues = function(value, min, max, barSize) {
      value = Math.max(min, Math.min(value, max - barSize) );
      var changed = (value != _value);
      _value = value;
      _min = min;
      _max = max;
      _barSize = barSize;
      layout();
      if (changed) {
        $scrollbar.trigger('scrollValueChange');
      }
    };
    /**
     * get layout values of toolbox and scroll bar
     * Input: -
     * @method getValue
     * @return {value} value
     */
    var getValue = function() {
      return _value;
    };
    controller($scrollbar, {
      setSize: setSize,
      setValues: setValues,
      getValue: getValue
    });
    return $scrollbar;
  };
  /**
   * Generates unigue id.
   * Input: -
   * @method getUniqueId
   * @return {string} simcir-id-generated id
   */
  var getUniqueId = function() {
    var uniqueIdCount = 0;
    return function() {
      return 'simcir-id' + uniqueIdCount++;
    };
  }();
  /**
   * Create the whole work spaces and handle everything happens inside.
   * Input: data
   * @method createWorkspace
   * @return {element} $workspace
   */
  var createWorkspace = function(data) {

    data = $.extend({
      width: 1100, //edited by ehsangharaei
      height: 500, //edited by ehsangharaei
      showToolbox: true,
      toolbox: defaultToolbox,
      devices: [{"type":"Power line (MV)","id":"dev0","x":350,"y":200,"label":"MV"},
                {"type":"Power line (LV)","id":"dev0","x":600,"y":350,"label":"LV"},
                {"type":"Power line (HV)","id":"dev0","x":100,"y":50,"label":"HV"}],
      connectors: [],
    }, data);

    var workspaceWidth = data.width;
    var workspaceHeight = data.height;
    var barWidth = unit;
    var toolboxWidth = data.showToolbox? unit * 8 + barWidth : 0;

    var $workspace = createSVG(
        workspaceWidth, workspaceHeight).
      attr('class', 'simcir-workspace');
    disableSelection($workspace);

    var $defs = createSVGElement('defs');
    $workspace.append($defs);

    !function() {

      // fill with pin hole pattern.
      var patId = getUniqueId();
      var pitch = unit / 2;
      var w = workspaceWidth - toolboxWidth;
      var h = workspaceHeight;

      $defs.append(createSVGElement('pattern').
          attr({id: patId, x: 0, y: 0,
            width: pitch / w, height: pitch / h}).append(
            createSVGElement('rect').attr('class', 'simcir-pin-hole').
            attr({x: 0, y: 0, width: 1, height: 1}) ) );

      $workspace.append(createSVGElement('rect').
          attr({x: toolboxWidth, y: 0, width: w, height: h}).
          css({fill: 'url(#' + patId + ')'}) );
    }();

    var $toolboxDevicePane = createSVGElement('g');
    var $scrollbar = createScrollbar();
    $scrollbar.on('scrollValueChange', function(event) {
      transform($toolboxDevicePane, 0,
          -controller($scrollbar).getValue() );
    });
    controller($scrollbar).setSize(barWidth, workspaceHeight);
    transform($scrollbar, toolboxWidth - barWidth, 0);
    var $toolboxPane = createSVGElement('g').
      attr('class', 'simcir-toolbox').
      append(createSVGElement('rect').
        attr({x: 0, y: 0,
          width: toolboxWidth,
          height: workspaceHeight}) ).
      append($toolboxDevicePane).
      append($scrollbar).on('wheel', function(event) {
        event.preventDefault();
        if (event.originalEvent.deltaY < 0) {
          $scrollbar.trigger('unitup');
        } else if (event.originalEvent.deltaY > 0) {
          $scrollbar.trigger('unitdown');
        }
      });

    var $devicePane = createSVGElement('g');
    transform($devicePane, toolboxWidth, 0);
    var $connectorPane = createSVGElement('g');
    var $temporaryPane = createSVGElement('g');

    enableEvents($connectorPane, false);
    enableEvents($temporaryPane, false);

    if (data.showToolbox) {
      $workspace.append($toolboxPane);
    }
    $workspace.append($devicePane);
    $workspace.append($connectorPane);
    $workspace.append($temporaryPane);
    /**
     * add device to simulator body
     * Input: $dev
     * @method addDevice
     * @return -
     */
    var addDevice = function($dev) {
      $devicePane.append($dev);
      $dev.trigger('deviceAdd');
    };
    /**
     * remove device from simulator body
     * Input: $dev
     * @method removeDevice
     * @return -
     */
    var removeDevice = function($dev) {
      $dev.trigger('deviceRemove');
      // before remove, disconnect all
      controller($dev).disconnectAll();
      $dev.remove();
      updateConnectors();
    };

    //---------added by ehsangharaei---------------
    $("#place-power-line").click(function() {

      powerLineVoltageLevel=$("input[name=optradio]:checked").val();
      newpowerLineLength=$("#lengthFromModal").val()?$("#lengthFromModal").val():200;
      var num_of_inputs=$("#numberOfInputsFromModal").val()?$("#numberOfInputsFromModal").val():5;
      if(powerLineVoltageLevel=='HV') {
        registerDevice('Power line (HV)', createLogicGateFactory(num_of_inputs, powerLine, drawPowerLine));
        var $dev = $devicePane.children('.simcir-device').find('.power-line-hv').closest('.simcir-device');
      }
      if(powerLineVoltageLevel=='MV') {
        registerDevice('Power line (MV)', createLogicGateFactory(num_of_inputs, powerLine, drawPowerLine));
        var $dev = $devicePane.children('.simcir-device').find('.power-line-mv').closest('.simcir-device');
      }
      if(powerLineVoltageLevel=='LV') {
        registerDevice('Power line (LV)', createLogicGateFactory(num_of_inputs, powerLine, drawPowerLine));
        var $dev = $devicePane.children('.simcir-device').find('.power-line-lv').closest('.simcir-device');
      }
      $dev = createDevice(controller($dev).deviceDef);
      $dev[0].firstChild.outerHTML=$dev[0].firstChild.outerHTML.replace("200", newpowerLineLength);
      adjustDevice($dev);
      addDevice($dev);
    });

    /**
     * disconnect nodes connection
     * Input: $inNode
     * @method disconnect
     * @return -
     */
    var disconnect = function($inNode) {
      var inNode = controller($inNode);
      if (inNode.getOutput() != null) {
        inNode.getOutput().disconnectFrom(inNode);
      }
      updateConnectors();
    };
    /**
     * update connections
     * Input: -
     * @method updateConnectors
     * @return -
     */
    var updateConnectors = function() {
      $connectorPane.children().remove();
      $devicePane.children('.simcir-device').each(function() {
        var device = controller($(this) );
        $.each(device.getInputs(), function(i, inNode) {
          if (inNode.getOutput() != null) {
            var p1 = offset(inNode.$ui);
            var p2 = offset(inNode.getOutput().$ui);
            $connectorPane.append(
                createConnector(p1.x, p1.y, p2.x, p2.y) );
          }
        });
      });
    };
    /**
     * load the toolbox
     * Input: data
     * @method loadToolbox
     * @return -
     */
    var loadToolbox = function(data) {
      var vgap = 8;
      var y = vgap;
      $.each(data.toolbox, function(i, deviceDef) {
        var $dev = createDevice(deviceDef);
        $toolboxDevicePane.append($dev);
        var size = controller($dev).getSize();
        transform($dev, (toolboxWidth - barWidth - size.width) / 2, y);
        y += (size.height + fontSize + vgap);
      });
      controller($scrollbar).setValues(0, 0, y, workspaceHeight);
    };
    /**
     * get data of all devices
     * Input: -
     * @method getData
     * @return -
     */
    var getData = function() {

      // renumber all id
      var devIdCount = 0;
      $devicePane.children('.simcir-device').each(function() {
        var $dev = $(this);
        var device = controller($dev);
        var devId = 'dev' + devIdCount++;
        device.id = devId;
        $.each(device.getInputs(), function(i, node) {
          node.id = devId + '.in' + i;
        });
        $.each(device.getOutputs(), function(i, node) {
          node.id = devId + '.out' + i;
        });
      });

      var toolbox = [];
      var devices = [];
      var connectors = [];
      /**
       * clone object to json string
       * Input: obj
       * @method clone
       * @return {JSON} JSON.parse(JSON.stringify(obj))
       */
      var clone = function(obj) {
        return JSON.parse(JSON.stringify(obj) );
      };
      $toolboxDevicePane.children('.simcir-device').each(function() {
        var $dev = $(this);
        var device = controller($dev);
        toolbox.push(device.deviceDef);
      });
      $devicePane.children('.simcir-device').each(function() {
        var $dev = $(this);
        var device = controller($dev);
        $.each(device.getInputs(), function(i, inNode) {
          if (inNode.getOutput() != null) {
            connectors.push({from:inNode.id, to:inNode.getOutput().id});
          }
        });
        var pos = transform($dev);
        var deviceDef = clone(device.deviceDef);
        deviceDef.id = device.id;
        deviceDef.x = pos.x;
        deviceDef.y = pos.y;
        deviceDef.label = device.getLabel();
        devices.push(deviceDef);
      });
      return {
        width: data.width,
        height: data.height,
        showToolbox: data.showToolbox,
        toolbox: toolbox,
        devices: devices,
        connectors: connectors
      };
    };
    /**
     * get text for the json show of the simulator
     * Input: -
     * @method getText
     * @return {String} buf
     */
    var getText = function() {

      var data = getData();

      var buf = '';
      var print = function(s) {
        buf += s;
      };
      var println = function(s) {
        print(s);
        buf += '\r\n';
      };
      var printArray = function(array) {
        $.each(array, function(i, item) {
          println('    ' + JSON.stringify(item) +
              (i + 1 < array.length? ',' : '') );
        });
      };
      /*println('{');
      println('  "width":' + data.width + ',');
      println('  "height":' + data.height + ',');
      println('  "showToolbox":' + data.showToolbox + ',');
      println('  "toolbox":[');
      printArray(data.toolbox);
      println('  ],');
      println('  "devices":[');
      printArray(data.devices);
      println('  ],');
      println('  "connectors":[');
      printArray(data.connectors);
      println('  ]');
      print('}');*/

      var lv_devices=[];
      var mv_devices=[];
      var hv_devices=[];
      var hv_power_line_ids=[];
      var mv_power_line_ids=[];
      var lv_power_line_ids=[];
      var hv_devices_ids=[];
      var mv_devices_ids=[];
      var lv_devices_ids=[];
      //find power lines IDs
      for(var i=0;i<data.devices.length;i++){
        if(data.devices[i].type=='Power line (HV)')
            hv_power_line_ids.push(data.devices[i].id);
        else if(data.devices[i].type=='Power line (MV)')
            mv_power_line_ids.push(data.devices[i].id);
        else if(data.devices[i].type=='Power line (LV)')
            lv_power_line_ids.push(data.devices[i].id);
        }
      //put devices to related power line id array
      for(var i=0;i<data.connectors.length;i++){
        for(var j=0;j<hv_power_line_ids.length;j++){
            if(data.connectors[i].from.substr(0,4)==hv_power_line_ids[j])
                hv_devices_ids.push(data.connectors[i].to);
        }
        for(var j=0;j<mv_power_line_ids.length;j++){
            if(data.connectors[i].from.substr(0,4)==mv_power_line_ids[j])
                mv_devices_ids.push(data.connectors[i].to);
        }
        for(var j=0;j<lv_power_line_ids.length;j++){
            if(data.connectors[i].from.substr(0,4)==lv_power_line_ids[j])
                lv_devices_ids.push(data.connectors[i].to);
        }
      }
      for(var i=0;i<hv_devices_ids.length;i++)
          hv_devices_ids[i]=hv_devices_ids[i].substr(0,4)
      for(var i=0;i<mv_devices_ids.length;i++)
          mv_devices_ids[i]=mv_devices_ids[i].substr(0,4)
      for(var i=0;i<lv_devices_ids.length;i++)
          lv_devices_ids[i]=lv_devices_ids[i].substr(0,4)

      //put non transformer devices to related power line device array
      for(var i=0;i<data.devices.length;i++) {
          for (var j = 0; j < hv_devices_ids.length; j++)
              if ( (hv_devices_ids[j] == data.devices[i].id)&&data.devices[i].type!='Transformer'&&data.devices[i].type!='Power line (HV)'&&data.devices[i].type!='Power line (MV)'&&data.devices[i].type!='Power line (LV)')
                  hv_devices.push(data.devices[i]);
          for (var j = 0; j < mv_devices_ids.length; j++)
              if ((mv_devices_ids[j] == data.devices[i].id)&&data.devices[i].type!='Transformer'&&data.devices[i].type!='Power line (HV)'&&data.devices[i].type!='Power line (MV)'&&data.devices[i].type!='Power line (LV)')
                  mv_devices.push(data.devices[i]);
          for (var j = 0; j < lv_devices_ids.length; j++)
              if ((lv_devices_ids[j] == data.devices[i].id)&&data.devices[i].type!='Transformer'&&data.devices[i].type!='Power line (HV)'&&data.devices[i].type!='Power line (MV)'&&data.devices[i].type!='Power line (LV)')
                  lv_devices.push(data.devices[i]);
      }
      //find power line connectors
        var power_line_connectors=[];
        var transformer_ids=[];
        for(var i=0;i<data.devices.length;i++){
          if(data.devices[i].type=='Transformer')
              transformer_ids.push(data.devices[i].id)
        }
        for(i=0;i<transformer_ids.length;i++){
          var connector={};
          connector.device=transformer_ids[i];
          for(j=0;j<data.connectors.length;j++){
            if(data.connectors[j].from.substring(0,4)==transformer_ids[i])
              connector.to=data.connectors[j].to.substring(0,4);
            if(data.connectors[j].to.substring(0,4)==transformer_ids[i])
                connector.from=data.connectors[j].from.substring(0,4);
          }
          //power_line_connectors.push('{"transformer_id":"'+connector.device+'","from":"'+connector.from+'","to":"'+connector.to+'"}');
            /*for(var k=0;k<data.devices.length;k++){
              if(connector.device==data.devices[k].id)
                connector.device=data.devices[k];
              if(connector.from==data.devices[k].id)
                  connector.from=data.devices[k];
              if(connector.to==data.devices[k].id)
                  connector.to=data.devices[k];
            }*/
            power_line_connectors.push(connector);
        }

        println('{');
        println('  "hv_power_line_devices":[');
        printArray(hv_devices);
        println('  ],');
        println('  "mv_power_line_devices":[');
        printArray(mv_devices);
        println('  ],');
        println('  "lv_power_line_devices":[');
        printArray(lv_devices);
        println('  ],');
        println('  "transformers":[');
        printArray(power_line_connectors);
        println('  ]');
        println('  "all_devices":[');
        printArray(data.devices);
        println('  ],');
        println('  "all_connections":[');
        printArray(data.connectors);
        println('  ]');
        print('}');



      return buf;
    };

    //-------------------------------------------
    // mouse operations

    var dragMoveHandler = null;
    var dragCompleteHandler = null;
    /**
     * adjust device position on simulator
     * Input: $dev
     * @method adjustDevice
     * @return -
     */
    var adjustDevice = function($dev) {
      var pitch = unit / 2;
      var adjust = function(v) { return Math.round(v / pitch) * pitch; };
      var pos = transform($dev);
      var size = controller($dev).getSize();
      var x = Math.max(0, Math.min(pos.x,
          workspaceWidth - toolboxWidth - size.width) );
      var y = Math.max(0, Math.min(pos.y,
          workspaceHeight - size.height) );
      transform($dev, adjust(x), adjust(y) );
    };
    /**
     * handle connecting a connection
     * Input: event, $target
     * @method beginConnect
     * @return -
     */
    var beginConnect = function(event, $target) {
      var $srcNode = $target.closest('.simcir-node');
      var off = $workspace.offset();
      var pos = offset($srcNode);
      if ($srcNode.attr('simcir-node-type') == 'in') {
        disconnect($srcNode);
      }
      dragMoveHandler = function(event) {
        var x = event.pageX - off.left;
        var y = event.pageY - off.top;
        $temporaryPane.children().remove();
        $temporaryPane.append(createConnector(pos.x, pos.y, x, y) );
      };
      dragCompleteHandler = function(event) {
        $temporaryPane.children().remove();
        var $dst = $(event.target);
        if (isActiveNode($dst) ) {
          var $dstNode = $dst.closest('.simcir-node');
          connect($srcNode, $dstNode);
          updateConnectors();
        }
      };
    };
    /**
     * make new dvice when drag a device from toolbox to simulator body
     * Input: event, $target
     * @method beginNewDevice
     * @return -
     */
    var beginNewDevice = function(event, $target) {
      var $dev = $target.closest('.simcir-device');
      var pos = offset($dev);
      $dev = createDevice(controller($dev).deviceDef);
      transform($dev, pos.x, pos.y);
      $temporaryPane.append($dev);
      var dragPoint = {
        x: event.pageX - pos.x,
        y: event.pageY - pos.y};
      dragMoveHandler = function(event) {
        transform($dev,
            event.pageX - dragPoint.x,
            event.pageY - dragPoint.y);
      };
      dragCompleteHandler = function(event) {
        var $target = $(event.target);
        if ($target.closest('.simcir-toolbox').length == 0) {
          $dev.detach();
          var pos = transform($dev);
          transform($dev, pos.x - toolboxWidth, pos.y);
          adjustDevice($dev);
          addDevice($dev);
        } else {
          $dev.remove();
        }
      };
    };

    var $selectedDevices = [];
    /**
     * make selected value of a device true
     * Input: $dev
     * @method addSelected
     * @return -
     */
    var addSelected = function($dev) {
      controller($dev).setSelected(true);
      $selectedDevices.push($dev);
    };
    /**
     * make all devices not selected
     * Input: -
     * @method deselectAll
     * @return -
     */
    var deselectAll = function() {
      $devicePane.children('.simcir-device').each(function() {
        controller($(this) ).setSelected(false);
      });
      $selectedDevices = [];
    };
    /**
     * handles dragging a device movements
     * Input: event, $target
     * @method beginMoveDevice
     * @return -
     */
    var beginMoveDevice = function(event, $target) {
      var $dev = $target.closest('.simcir-device');
      var pos = transform($dev);
      if (!controller($dev).isSelected() ) {
        deselectAll();
        addSelected($dev);
        // to front.
        $dev.parent().append($dev.detach() );
      }

      var dragPoint = {
        x: event.pageX - pos.x,
        y: event.pageY - pos.y};
      dragMoveHandler = function(event) {
        // disable events while dragging.
        enableEvents($dev, false);
        var curPos = transform($dev);
        var deltaPos = {
          x: event.pageX - dragPoint.x - curPos.x,
          y: event.pageY - dragPoint.y - curPos.y};
        $.each($selectedDevices, function(i, $dev) {
          var curPos = transform($dev);
          transform($dev,
              curPos.x + deltaPos.x,
              curPos.y + deltaPos.y);
        });
        updateConnectors();
      };
      dragCompleteHandler = function(event) {
        var $target = $(event.target);
        enableEvents($dev, true);
        $.each($selectedDevices, function(i, $dev) {
          if ($target.closest('.simcir-toolbox').length == 0) {
            adjustDevice($dev);
            updateConnectors();
          } else {
            removeDevice($dev);
          }
        });
      };
    };
    /**
     *
     * Input: event, $target
     * @method beginSelectDevice
     * @return -
     */
    var beginSelectDevice = function(event, $target) {
      /**
       *
       * Input: rect1, rect2
       * @method intersect
       * @return -
       */
      var intersect = function(rect1, rect2) {
        return !(
            rect1.x > rect2.x + rect2.width ||
            rect1.y > rect2.y + rect2.height ||
            rect1.x + rect1.width < rect2.x ||
            rect1.y + rect1.height < rect2.y);
      };
      /**
       *
       * Input: p1, p2
       * @method pointToRect
       * @return -
       */
      var pointToRect = function(p1, p2) {
        return {
          x: Math.min(p1.x, p2.x),
          y: Math.min(p1.y, p2.y),
          width: Math.abs(p1.x - p2.x),
          height: Math.abs(p1.y - p2.y)};
      };
      deselectAll();
      var off = $workspace.offset();
      var pos = offset($devicePane);
      var p1 = {x: event.pageX - off.left, y: event.pageY - off.top};
      dragMoveHandler = function(event) {
        deselectAll();
        var p2 = {x: event.pageX - off.left, y: event.pageY - off.top};
        var selRect = pointToRect(p1, p2);
        $devicePane.children('.simcir-device').each(function() {
          var $dev = $(this);
          var devPos = transform($dev);
          var devSize = controller($dev).getSize();
          var devRect = {
              x: devPos.x + pos.x,
              y: devPos.y + pos.y,
              width: devSize.width,
              height: devSize.height};
          if (intersect(selRect, devRect) ) {
            addSelected($dev);
          }
        });
        $temporaryPane.children().remove();
        $temporaryPane.append(createSVGElement('rect').
            attr(selRect).
            attr('class', 'simcir-selection-rect') );
      };
    };
    /**
     * handles what mouse down should does
     * Input: event
     * @method mouseDownHandler
     * @return -
     */
    var mouseDownHandler = function(event) {
      event.preventDefault();
      event.stopPropagation();
      var $target = $(event.target);
      if (isActiveNode($target) ) {
        beginConnect(event, $target);
      } else if ($target.closest('.simcir-device').length == 1) {
        if ($target.closest('.simcir-toolbox').length == 1) {
          beginNewDevice(event, $target);
        } else {
          beginMoveDevice(event, $target);
        }
      } else {
        beginSelectDevice(event, $target);
      }
      $(document).on('mousemove', mouseMoveHandler);
      $(document).on('mouseup', mouseUpHandler);
    };
    /**
     * handles what mouse move should does
     * Input: event
     * @method mouseMoveHandler
     * @return -
     */
    var mouseMoveHandler = function(event) {
      if (dragMoveHandler != null) {
        dragMoveHandler(event);
      }
    };
    /**
     * handles what mouse up should does
     * Input: event
     * @method mouseUpHandler
     * @return -
     */
    var mouseUpHandler = function(event) {
      if (dragCompleteHandler != null) {
        dragCompleteHandler(event);
      }
      dragMoveHandler = null;
      dragCompleteHandler = null;
      $devicePane.children('.simcir-device').each(function() {
        enableEvents($(this), true);
      });
      $temporaryPane.children().remove();
      $(document).off('mousemove', mouseMoveHandler);
      $(document).off('mouseup', mouseUpHandler);
    };
    $workspace.on('mousedown', mouseDownHandler);

    //-------------------------------------------


    loadToolbox(data);
    $.each(buildCircuit(data, false), function(i, $dev) {
      addDevice($dev);
    });
    updateConnectors();

    controller($workspace, {
      data: getData,
      text: getText
    });

    return $workspace;
  };
  /**
   * setup simulator and workspace and handles switching between json view and circuit view.
   * Input: $placeHolder, data
   * @method setupSimcir
   * @return {element} $placeHolder
   */
  var setupSimcir = function($placeHolder, data) {
    var $workspace = simcir.createWorkspace(data);
    var $dataArea = $('<textarea></textarea>').
      addClass('simcir-json-data-area').
      attr('readonly', 'readonly').
      css('width', $workspace.attr('width') + 'px').
      css('height', $workspace.attr('height') + 'px');
    var showData = false;
    /**
     * handles toggle between simulator show or data show
     * Input: -
     * @method toggle
     * @return -
     */
    var toggle = function() {
      $workspace.css('display', !showData? 'inline' : 'none');
      $dataArea.css('display', showData? 'inline' : 'none');
      if (showData) {
        $dataArea.val(controller($workspace).text() ).focus();
      }
      showData = !showData;
    };
    $placeHolder.text('');
    $placeHolder.append($('<div></div>').
        addClass('simcir-body').
        append($workspace).
        append($dataArea).
        on('click', function(event) {
          if (event.ctrlKey || event.metaKey) {
            toggle();
          }
        }));
    toggle();
    return $placeHolder;
  };
  /**
   * Make HTML view based on JSON data for doc view.
   * Input: $placeHolder
   * @method setupSimcirDoc
   * @return -
   */
  var setupSimcirDoc = function($placeHolder) {
    var $table = $('<table><tbody></tbody></table>').
      addClass('simcir-doc-table');
    $.each(defaultToolbox, function(i, deviceDef) {
      var $dev = createDevice(deviceDef);
      var device = controller($dev);
      if (!device.doc) {
        return;
      }
      var doc = $.extend({description: '', params: []},device.doc);
      var size = device.getSize();

      var $tr = $('<tr></tr>');
      var hgap = 32;
      var vgap = 8;
      var $view = createSVG(size.width + hgap * 2,
          size.height + vgap * 2 + fontSize);
      var $dev = createDevice(deviceDef);
      transform($dev, hgap, vgap);

      $view.append($dev);
      $tr.append($('<td></td>').css('text-align', 'center').append($view) );
      var $desc = $('<td></td>');
      $tr.append($desc);

      if (doc.description) {
        $desc.append($('<span></span>').
            text(doc.description) );
      }

      if (doc.params.length > 0) {
        $desc.append($('<div>Params</div>').addClass('simcir-doc-title') );
        var $paramsTable = $('<table><tbody></tbody></table>').
          addClass('simcir-doc-params-table');
        $paramsTable.children('tbody').append($('<tr></tr>').
            append($('<th>Name</th>') ).
            append($('<th>Type</th>') ).
            append($('<th>Default</th>') ).
            append($('<th>Description</th>') ) );
        $paramsTable.children('tbody').append($('<tr></tr>').
            append($('<td>type</td>') ).
            append($('<td>string</td>') ).
            append($('<td>-</td>').
                css('text-align', 'center') ).
            append($('<td>"' + deviceDef.type + '"</td>') ) );
        $paramsTable.children('tbody').append($('<tr></tr>').
            append($('<td>label</td>') ).
            append($('<td>string</td>') ).
            append($('<td>same with type</td>').css('text-align', 'center') ).
            append($('<td>label for a device.</td>') ) );

        $.each(doc.params, function(i, param) {
          $paramsTable.children('tbody').append($('<tr></tr>').
            append($('<td></td>').text(param.name) ).
            append($('<td></td>').text(param.type) ).
            append($('<td></td>').css('text-align', 'center').
                text(param.defaultValue) ).
            append($('<td></td>').text(param.description) ) );
        });
        $desc.append($paramsTable);
      }

      if (doc.code) {
        $desc.append($('<div>Code</div>').addClass('simcir-doc-title') );
        $desc.append($('<div></div>').
            addClass('simcir-doc-code').text(doc.code) );
      }

      $table.children('tbody').append($tr);
    });

    $placeHolder.append($table);
  };


  /**
   * creates logic gate factory
   * Input: op, out, draw
   * @method createLogicGateFactory
   * @return -
   */
  var createLogicGateFactory = function(op, out, draw) {
    return function(device) {
      if(device.deviceDef.type =='Power line (HV)' || device.deviceDef.type =='Power line (LV)' || device.deviceDef.type =='Power line (MV)') {
        var numInputs=op;
      }
      else {
        var numInputs = (op == null) ? 1 :
            Math.max(2, device.deviceDef.numInputs || 2);
      }
      device.numOfInputs=numInputs;
      device.halfPitch = numInputs > 2;
      for (var i = 0; i < numInputs; i += 1) {
        var currentInput=i;
        device.addInput('','',numInputs,currentInput);
      }
      device.addOutput();
      var inputs = device.getInputs();
      var outputs = device.getOutputs();
      device.$ui.on('inputValueChange', function() {
        var b = intValue(inputs[0].getValue() );
        if (op != null) {
          for (var i = 1; i < inputs.length; i += 1) {
            b = op(b, intValue(inputs[i].getValue() ) );
          }
        }
        b = out(b);
        outputs[0].setValue( (b == 1)? 1 : null);
      });
      var super_createUI = device.createUI;
      device.createUI = function() {
        super_createUI();
        var size = device.getSize();
        var g = graphics(device.$ui);
        g.attr['class'] = 'simcir-basicset-symbol';
        draw(g,
            (size.width - unit) / 2,
            (size.height - unit) / 2,
            unit, unit);
        if (op != null) {
          device.doc = {
            params: [
              {name: 'numInputs', type: 'number',
                defaultValue: 2,
                description: 'number of inputs.'}
            ],
            code: '{"type":"' + device.deviceDef.type + '","numInputs":2}'
          };
        }
      };
    };
  };
  /**
   * draw power line
   * Input: g, x, y, width, height
   * @method drawPowerLine
   * @return -
   */
  var drawPowerLine=function(g, x, y, width, height) {
    //g.moveTo(x, y);
    /*g.lineTo(x + width, y + height / 2);
     g.lineTo(x, y + height);
     g.lineTo(x, y);*/
    //g.closePath(true);
  };
  /**
   * handles power line logic
   * Input: a
   * @method powerLine
   * @return a
   */
  var powerLine= function(a) { return a; };
  //for test

  $(function() {
    $('.simcir').each(function() {
      var $placeHolder = $(this);
      var text = $placeHolder.text().replace(/^\s+|\s+$/g, '');
      setupSimcir($placeHolder, JSON.parse(text || '{}') );
    });
  });

  $(function() {
    $('.simcir-doc').each(function() {
      setupSimcirDoc($(this) );
    });
  });

    /**
     * Zooming
     * Input: -
     * @method svgPanZoom
     * @return -
     */
  $( document ).ready(function() {
      var svgElement = document.querySelector('.simcir-workspace');
      var panZoomTiger = svgPanZoom(svgElement,{
          viewportSelector: '.svg-pan-zoom_viewport'
          , panEnabled: false
          , controlIconsEnabled: true
          , zoomEnabled: true
          , dblClickZoomEnabled: false
          , mouseWheelZoomEnabled: false
          , preventMouseEventsDefault: true
          , zoomScaleSensitivity: 0.2
          , minZoom: 0.5
          , maxZoom: 10
          , fit: true
          , contain: false
          , center: true
          , refreshRate: 'auto'
          , beforeZoom: function(){}
          , onZoom: function(){}
          , beforePan: function(){}
          , onPan: function(){}
          //, customEventsHandler: {}
          , eventsListenerElement: null
      });

  });

  return {
    registerDevice: registerDevice,
    setupSimcir: setupSimcir,
    createWorkspace: createWorkspace,
    createSVGElement: createSVGElement,
    addClass: addClass,
    removeClass: removeClass,
    hasClass: hasClass,
    offset: offset,
    transform: transform,
    enableEvents: enableEvents,
    graphics: graphics,
    controller: controller,
    unit: unit
  };
}(jQuery);
