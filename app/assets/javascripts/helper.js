function checkIframeLoaded(iframe_id) {
    console.log('Checking for ' +  iframe_id);
    // Get a handle to the iframe element
     iframe = document.getElementById(iframe_id);

    var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    
    console.log(iframeDoc.readyState);
    // Check if loading is complete
    if (  iframeDoc.readyState  == 'complete' ) {
      return true;
    } else {
      return false;
    }
    
    // If we are here, it is not loaded. Set things up so we check   the status again in 100 milliseconds
}

function checkNested(obj /*, level1, level2, ... levelN*/) {
  var args = Array.prototype.slice.call(arguments),
      obj = args.shift();
  if(obj === null || obj === undefined){
    return false;
  }
  for (var i = 0; i < args.length; i++) {
    if (!obj.hasOwnProperty(args[i])) {
      return false;
    }
    obj = obj[args[i]];
  }
  return true;
}
function whitelistJson(obj, whitelist, separator) {
    var object = {};

    for (var i = 0, length = whitelist.length; i < length; ++i) {
        var k = 0,
            names = whitelist[i].split(separator || '.'),
            value = obj,
            name,
            count = names.length - 1,
            ref = object,
            exists = true;

        // fill in any empty objects from first name to end without
        //  picking up neighboring fields
        while (k < count) { // walks to n - 1
            name = names[k++];
            value = value[name];

            if (typeof value !== 'undefined') {
                if (typeof object[name] === 'undefined') {
                    ref[name] = {};
                }

                ref = ref[name];
            }
            else {
                exists = false;
                break;
            }
        }

        if (exists) {
            ref[names[count]] = value[names[count]];
        }
    }

    return object;
}
var renderTemplate = function(template_id,obj){
  var template = $("#" + template_id).html();
    _.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g
  };
  var rendered_element = _.template(template,obj);
  return rendered_element;
};
var renderTemplate2 = function(template_id,obj){
  var template = $("#" + template_id).html();
     _.templateSettings = {
            interpolate: /\<\@\=(.+?)\@\>/gim,
            evaluate: /\<\@(.+?)\@\>/gim,
            escape: /\<\@\-(.+?)\@\>/gim
        };
  var rendered_element = _.template(template,obj);
  return rendered_element;
};
function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
var guid = (function() {
  
  return function() {
    return 'bg_' + s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  };
})();

function getPageHeaderJSON(){
  var header =  {
            "bg_uniq_id": guid(),
            "id": "header_" + s4() ,
            "klass": "",
            "bgmanage_type": "header",
            "data_position":"fixed",
            "data_theme_swatch" : "b",
            "left":null,
            "center":{
              "bg_uniq_id" : guid(),
              "id": "header_heading_" +s4(),
              "klass": "",
              "bgmanage_type": "heading",
              "text":"Change",
              "heading_type":"h3"
             },
            "right":null
        };
  return header;
}
function getPageFooterJSON(){
  var footer = {
          "bg_uniq_id": guid(),
          "id": "",
          "klass": "",
          "icon_position": "top",
          "data_theme_swatch" :"b",
          "bgmanage_type": "footer",
          "tabs": [
            {
              "text": "Text 1",
              "link_to": "",
              "icon": "plus",
              "transition":"none"
            },
            {
              "text": "Text 2",
              "link_to": "",
              "icon": "plus",
              "transition":"none"
            },
            {
              "text": "Text 3",
              "link_to": "",
              "icon": "plus",
              "transition":"none"
            }
          ]
        };
      return footer;
}
function getNewLinkButtonJSON(align){
  var widget = {
              "bg_uniq_id": guid(),
              "id": "",
              "klass": "",
              "bgmanage_type": "link_button",
              "text" : "Button",
              "icon" : "home",
              "icon_position" : "left",
              "data_theme_swatch" : "b",
              "link_to":"",
              "transition":"none"
            }
  return widget;
}
function getNewImageJSON(align){
  var widget = {
              "bg_uniq_id": guid(),
              "id": "",
              "klass": "",
              "bgmanage_type": "image",
              "image_url" : "",
              "image_align" : align,
              "width":288,
              "height":200,
              "width_type" :'px',
              "height_type" :'px'
    }
  return widget;
}
function getNewMapJSON(align){
  var widget = {
              "bg_uniq_id": guid(),
              "id": "",
              "klass": "",
              "bgmanage_type": "map",
              "location" : "Mumbai",
              "width":288,
              "height":200,
              "zoom" :14
              
    }
  return widget;
}
function getNewNavbarButtonJSON(){
  return        {
                  "text": "Button",
                  "icon":"arrow-l",
                  "link_to":"",
                  "transition":"none",
                  "theme":"a",
                  "is_active":false,
                  "bgmanage_type":"navbar_button",
                  "bg_uniq_id":guid()
                }
}
function getNewNavbarJSON(){
  var widget = {
              "bg_uniq_id": guid(),
              "id": "",
              "klass": "",
              "bgmanage_type": "navbar",
              "icon_position":"left",
              "members" : []              
    }
  widget.members.push(getNewNavbarButtonJSON());
  widget.members.push(getNewNavbarButtonJSON());
  widget.members.push(getNewNavbarButtonJSON());
  return widget;
}

function getLinkButtonHtml(align,link_button_data){
  console.log("Link button data is");
  console.log(link_button_data);
    var link_button = $(renderTemplate('link_button_template',link_button_data));
    console.log("Link_button is");
    console.log($('<div>').append(link_button.clone()).html());
    return link_button;
}

function getPlaceHolderHeaderLinkButton (align){
  return  $(renderTemplate('link_button_template_placeholder_'+align,{}));
};
function getNewHeaderHeadingJSON(){
  var header_heading = {
      "bg_uniq_id": guid(),
      "id": "",
      "klass": "",
      "bgmanage_type": "heading",
      "text": "Heading",
      "heading_type": "h3"
  };
  return header_heading;
}

function getHeaderHtml(header_data){
  var header_html = $(renderTemplate('header_template',header_data));
  if(header_data.left === null || header_data.left === undefined){
    var left_link_button = $(renderTemplate('link_button_template_placeholder_left',{}));
    header_html.append(left_link_button); 
  } else {
   
    header_html.append(getLinkButtonHtml('left',header_data.left));  
  }
  if(!nullOrUndefined(header_data.center)){
    var header_heading = $(renderTemplate('heading_template',header_data.center));
    header_html.append(header_heading); 
  }
  else {
    var heading_json = getNewHeaderHeadingJSON();
    heading_json.text = "";
    var header_heading = $(renderTemplate('heading_placeholder_template',heading_json));
    header_html.append(header_heading); 
  }

  if(header_data.right === null || header_data.right === undefined){
    var right_link_button = $(renderTemplate('link_button_template_placeholder_right',{}));
    header_html.append(right_link_button); 
  } else {
   header_html.append(getLinkButtonHtml('right',header_data.right));  
  }
  return header_html; 
}
function getTabbedFooterHtml(tabbed_footer_data){
  var tabbed_footer_html = renderTemplate2('tabbed_footer_template',tabbed_footer_data);
  console.log("Tabbed Footer");
  console.log(tabbed_footer_html);
  return tabbed_footer_html;
}
function getImageHtml(image_data) {

  var image_html = $(renderTemplate('image_template',image_data));
  if(nullOrUndefined(image_data['image_url']) || $.trim(image_data['image_url']).length === 0){
    $(image_html).css('background','url(/icons/image.png) no-repeat center');
  }

  return image_html;
}
function getMapHtml(map_data) {
  var map_html = $(renderTemplate('map_template',map_data));
  return map_html;
}
function getNavbarHtml(navbar_data) {
  var navbar_html = $(renderTemplate('navbar_template',navbar_data));
  if(nullOrUndefined(navbar_data.members) == false){
    for(var i=0;i<navbar_data.members.length;i++){
      var navmember = navbar_data.members[i];
      var navbar_member_html = $(renderTemplate('navbar_member_template',navmember));
      $(navbar_html).find('ul').append($(navbar_member_html));
    }
  }
  console.log(navbar_html.html());
  return navbar_html;
}
function getContentHtml(content_data){
  var content_html = $(renderTemplate('content_template',{})); 
  if(!nullOrUndefined(content_data) && !nullOrUndefined(content_data.members)){
    
    for(var i=0;i<content_data.members.length;i++){
      var widget = content_data.members[i];
      if(widget.bgmanage_type === 'image'){
        content_html.append(getImageHtml(widget));
      }
      //TODO add others here

    }
  }
  return content_html; 
}

function getFooterHtml(footer_data){
  var header_html = $(renderTemplate2('footer_template',footer_data)); 
  return header_html; 
}

function getPageHtml(page_data){
  var page_html = $(renderTemplate('page_template',page_data)); 
  if(checkNested(page_data,'header') == true){
    page_html.append(getHeaderHtml(page_data.header));   
  }
  if(checkNested(page_data,'members') == true){
    page_html.append(getContentHtml(page_data.members));   
  
  }
  if(checkNested(page_data,'footer') == true){
    page_html.append(getFooterHtml(page_data.footer));
  }
  return page_html;
}
function getDeviceHtml(device_data) {
    //var rendered_device = _.template($('#phone_contents').html(),{});
    //$( '#device_frame' ).contents().find( 'body' ).html(rendered_device);
    pages = []
    if( checkNested(device_data,'app','pages') == false){
      throw 'Cannot getDeviceHtml, device_data is incorrect';
    }
    for (var i = 0;i< device_data.app.pages.length;i++){
      pages.push(getPageHtml(device_data.app.pages[i]));
    }
    return pages;  
}
function  getUpdatedClass(oldClass,newClass)  {
  if(oldClass == undefined || oldClass == null){
    oldClass = '';
  }
  if(newClass == undefined || newClass == null){
    newClass = '';
  }
  oldClassMembers = oldClass.split(' ');
  oldClassMembers = _.filter(oldClassMembers,function(str){
    return (str.lastIndexOf('bgcontrol') === 0) || (str.lastIndexOf('ui-') === 0)
  });
  console.log(oldClassMembers);
  newClassMembers = newClass.split(' ');
  newClassMembers = _.union(oldClassMembers,newClassMembers);
  newClassMembers = _.uniq(newClassMembers);
  return newClassMembers.join(' ');  
}

function getHtml(widgetData){
  if(widgetData.bgmanage_type == 'image'){
    return getImageHtml(widgetData);
  } else if(widgetData.bgmanage_type == 'map') {
    return getMapHtml(widgetData);
  } else if(widgetData.bgmanage_type == 'navbar'){
    return getNavbarHtml(widgetData);
  }else {
    return null;
  }
}

function getDragData(element) {
  return ($(element));
}
function nullOrUndefined(obj){
  if(obj === null || obj === undefined){
    return true;
  } else {
    return false;
  }
}
function convertHeaderDataToDocumentTree(headerData){
  if(nullOrUndefined(headerData)){
    return null;
  }
  var tocItem = {
    id: headerData.bg_uniq_id,
    title : headerData.bgmanage_type,
    items : []
  }
  if(!nullOrUndefined(headerData.left)){
    var leftItem = {
      id: headerData.left.bg_uniq_id,
      title: headerData.left.bgmanage_type,
      items:[]
    }
    tocItem.items.push(leftItem);
  }
  if(!nullOrUndefined(headerData.center)){
    var centerItem = {
      id: headerData.center.bg_uniq_id,
      title: headerData.center.bgmanage_type,
      items:[]
    }
    tocItem.items.push(centerItem);
  }
  if(!nullOrUndefined(headerData.right)){
    var rightItem = {
      id: headerData.center.bg_uniq_id,
      title: headerData.center.bgmanage_type,
      items:[]
    }
    tocItem.items.push(rightItem);
  }

  return tocItem;
}

function convertWidgetDataToDocumentTree(appData){
  if(nullOrUndefined(appData)){
    return [];
  }
  var tocArray = [];
  //TODO validate the presence of this data
  for(var i=0;i<appData.app.pages.length;i++){
        console.log("Building toc from page");
        var page = appData.app.pages[i];
        console.log(page);
        var tocItem = {
          id: page.bg_uniq_id,
          title : page.bgmanage_title,
          items : []
        }
        if(!nullOrUndefined(page.header)){
          tocItem.items.push(convertHeaderDataToDocumentTree(page.header));
        }
        tocArray.push(tocItem);
  }
  console.log("Returning tocArray",tocArray);
  return tocArray;
}
function convertWidgetDataToTOC(appData){
  if(nullOrUndefined(appData)){
    return [];
  }
  var tocArray = [];
    //TODO validate the presence of this data
  for(var i=0;i<appData.app.pages.length;i++){
        console.log("Building toc from page");
        var page = appData.app.pages[i];
        console.log(page);
        var tocItem = {
          bg_uniq_id: page.bg_uniq_id,
          title : page.bgmanage_title,
          items : []
        }
        
        tocArray.push(tocItem);
  }
  console.log("Returning tocArray",tocArray);
  return tocArray;
}

function getNewPageJSON(){
	var pageJSON = {
                "bg_uniq_id": guid(),
                "id": guid(),
                "klass": "",
                "bgmanage_type": "page",
                "bgmanage_title": "Untitled Page",
                "data_dialog": "true",
                "data_theme_swatch":"a",
                "header": {
                    "bg_uniq_id": guid(),
                    "id": "header",
                    "klass": "",
                    "bgmanage_type": "header",
                    "data_position": "fixed",
                    "data_theme_swatch": "b",
                    "left": {
                        "bg_uniq_id": guid(),
                        "id": "left_button_header",
                        "klass": "",
                        "bgmanage_type": "link_button",
                        "text": "Home",
                        "icon": "home",
                        "icon_position": "left",
                        "data_theme_swatch": "b",
                        "link_to":"",
                        "transition":"none"
                    },
                    "center": {
                        "bg_uniq_id": guid(),
                        "id": "header_heading",
                        "klass": "",
                        "bgmanage_type": "heading",
                        "text": "This is the heading",
                        "heading_type": "h3"
                    },
                    "right": null
                },
                "content": {
                    "bg_uniq_id": "bg_uniq_content_1",
                    "bgmanage_type": "content",
                    "id": "",
                    "klass": "",
                    "members": []
                },
                "footer": {
                    "bg_uniq_id": guid(),
                    "id": "",
                    "klass": "",
                    "icon_position": "top",
                    "data_theme_swatch": "b",
                    "bgmanage_type": "footer",
                    "tabs": [
                        {
                            "text": "Text 1",
                            "link_to": "",
                            "icon": "plus",
                            "transition": "none"
                        },
                        {
                            "text": "Text 2",
                            "link_to": "",
                            "icon": "plus",
                            "transition": "none"
                        },
                        {
                            "text": "Text 3",
                            "link_to": "",
                            "icon": "plus",
                            "transition": "none"
                        }
                    ]
                }
            }
    return pageJSON;
}

function updateData(widgetData,updateWidgetData){
      
      //TODO validate widgetData
      if(nullOrUndefined(widgetData) || nullOrUndefined(widgetData.bg_uniq_id) || nullOrUndefined(widgetData.bgmanage_type)){
        console.log("Invalid Widget Data");
        return;
      }
      if(nullOrUndefined(updateWidgetData)){
        console.log("Invalid Updated widget Data");
        return;
      }
      if(widgetData.bg_uniq_id !== updateWidgetData.bg_uniq_id){
        console.log("bg_uniq_id mismatch while updating data");
        return;
      }
      var keys = whiteListKeys[widgetData.bgmanage_type];
      if(nullOrUndefined(keys)){
        console.log("Coudl not find keys from whiteListKeys");
        return;
      }
      for(var i = 0;i<keys.length;i++){
        var key = keys[i];
        if(key === 'bgmanage_type' || key === 'bg_uniq_id'){
          continue;
        }
        widgetData[key] = updateWidgetData[key];

      }
      
}
