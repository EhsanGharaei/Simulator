//
// SimcirJS - basicset
//
// Copyright (c) 2014 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//  http://www.opensource.org/licenses/mit-license.php
//

/**
 * Base function of SimcirJS
 *
 * @class simcir-basicSet
 */
!function($, $s) {

  // unit size
  var unit = $s.unit;

  // symbol draw functions
  var drawPowerLine=function(g, x, y, width, height) {
    //g.moveTo(x, y);
    /*g.lineTo(x + width, y + height / 2);
     g.lineTo(x, y + height);
     g.lineTo(x, y);*/
    //g.closePath(true);
  };
  var drawBUF = function(g, x, y, width, height) {
    //g.moveTo(x, y);
    /*g.lineTo(x + width, y + height / 2);
    g.lineTo(x, y + height);
    g.lineTo(x, y);*/
    //g.closePath(true);
  };
  var drawAND = function(g, x, y, width, height) {
    /*g.moveTo(x, y);
    g.curveTo(x + width, y, x + width, y + height / 2);
    g.curveTo(x + width, y + height, x, y + height);
    g.lineTo(x, y);
    g.closePath(true);*/
  };
  var drawNOT = function(g, x, y, width, height) {
    //drawBUF(g, x - 1, y, width - 2, height);
    //g.drawCircle(x + width - 1, y + height / 2, 2);
  };
  var drawNAND = function(g, x, y, width, height) {
    //drawAND(g, x - 1, y, width - 2, height);
    //g.drawCircle(x + width - 1, y + height / 2, 2);
  };
  // logical functions
  var powerLine= function(a) { return a; };
  var AND = function(a, b) { return a & b; };
  var BUF = function(a) { return (a == 1)? 1 : 0; };
  var NOT = function(a) { return (a == 1)? 0 : 1; };

  var isHot = function(v) { return v != null; };
  var intValue = function(v) { return isHot(v)? 1 : 0; };

  var createLogicGateFactory = function(op, out, draw) {
    return function(device) {
      if(device.deviceDef.type =='Power line') {
        var numInputs=op;
      }
      else {
        var numInputs = (op == null) ? 1 :
            Math.max(2, device.deviceDef.numInputs || 2);
      }
      device.halfPitch = numInputs > 2;
      for (var i = 0; i < numInputs; i += 1) {
        device.addInput();
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
        var g = $s.graphics(device.$ui);
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



  /*$(".power-line-register").click(function(){
    /!*var powerLineLength=prompt('Enter the length of the line(Default is 500):');
    var $dev=$devicePane.children('.simcir-device').find('.power-line').closest('.simcir-device');
    $dev = createDevice(controller($dev).deviceDef);
    $dev[0].firstChild.outerHTML=$dev[0].firstChild.outerHTML.replace("500", powerLineLength ? powerLineLength:"500");
    console.log($dev);
    adjustDevice($dev);
    addDevice($dev);*!/
    $s.registerDevice('Power line', createLogicGateFactory(5, powerLine, drawPowerLine) );
    /!*$('.simcir').each(function() {
      var $placeHolder = $(this);
      var text = $placeHolder.text().replace(/^\s+|\s+$/g, '');
      $s.setupSimcir($placeHolder, JSON.parse(text || '{}') );
    });*!/
    console.log('done');
  });*/



  // register logic gates
  $s.registerDevice('Transformer', createLogicGateFactory(null, BUF, drawBUF) );
  $s.registerDevice('Nuclear power plant', createLogicGateFactory(null, NOT, drawNOT) );
  $s.registerDevice('windmill', createLogicGateFactory(null, BUF, drawAND) );
  $s.registerDevice('Power line', createLogicGateFactory(0, powerLine, drawPowerLine) );






}(jQuery, simcir);
