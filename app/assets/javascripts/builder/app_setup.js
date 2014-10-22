//globals
var ALREADY_DROPPED = false;
var DRAG_DATA = null;
var APP_PAGES = [
          {name:'Home',value:'home'},
          {name:'Videos',value:'videos'}
        ];
var ACTIVE_PAGE_BG_UNIQ_ID = null;

var whiteListKeys = {
        'page':['bg_uniq_id','id','klass','bgmanage_type','bgmanage_title','data_dialog','data_theme_swatch'],
        'header':['bg_uniq_id','id','klass','bgmanage_type','data_position','data_theme_swatch'],
        'heading':['bg_uniq_id','id','klass','bgmanage_type','text','heading_type'],
        'link_button':['bg_uniq_id','id','klass','bgmanage_type','text','icon','icon_position','data_theme_swatch','link_to',"transition"],
        'image':['bg_uniq_id','id','klass','bgmanage_type','image_url','image_align','width','height','width_type','height_type'],
        'map':['bg_uniq_id','id','klass','bgmanage_type','location','zoom','map_align','width','height'],
        'navbar':['bg_uniq_id','id','klass','bgmanage_type','members','icon_position','"data_theme_swatch"'],
        'footer':['bg_uniq_id','id','klass','bgmanage_type','tabs','icon_position','data_theme_swatch']
}

var builderApp = angular.module('builderApp', ["ngRoute","ngSanitize","ui.sortable","ui.bootstrap"]);
$(function(){
    $(window).on("navigate", function (event, data) {
  var direction = data.state.direction;
  if (direction == 'back') {
    alert('back');
    event.preventDefault();
  }
  if (direction == 'forward') {
    // do something else
  }
});
    
});

