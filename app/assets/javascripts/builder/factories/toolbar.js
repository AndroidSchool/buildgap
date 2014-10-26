builderApp.factory('Toolbar',function($http){
    var Toolbar = function(){
      console.log("Setting up the toolbar");
    }
    Toolbar.prototype.setupControls = function(callback){
      console.log("Setting up controls");
      $('.component').draggable({
        helper: "clone",
        appendTo: "body",
        revert: "invalid",
        iframeFix:true,
        refreshPositions: true
      }).on('dragstart', function (e, ui) {
        console.log("Dragstart")
        $(ui.helper).css('z-index','999999');
        DRAG_DATA = null;
      }).on('dragstop', function (e, ui) {
        console.log("Drag stopped");
        ui.helper.remove();
      });
      callback(null);
    }
    return Toolbar;
});
