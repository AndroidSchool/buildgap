builderApp.factory('DeviceTestPage',function($http){
    var DeviceTestPage = function(parentController){
        //TODO null checks
        var self = this;
        this.parentController = parentController;
        
    }
    DeviceTestPage.prototype.reload = function() {
      var self = this;
      //alert('Loading Test Page');
      var iframe = $('<iframe>',{
        id:"device_test_iframe",
        style:"border:none;", 
        width:"100%", 
        height:"100%",
        src:'/iframetest.html'
       }).appendTo('#test_device_iframe_holder').load(function(){
        console.log(self.parentController.getUpdatedAppHtml());
   
        var custom_js = renderTemplate('custom_js_template',{custom_js : self.parentController.appData.app.javascript.custom_js });
        var custom_css = renderTemplate('custom_css_template',{custom_css : self.parentController.appData.app.css.custom_css });
        var body = renderTemplate('device_test_iframe_template',{});

        $(iframe).contents().find('body').html(self.parentController.getUpdatedAppHtml());
        for( var i = 0;i<self.parentController.appData.app.css.files.length;i++){
          var external_css = renderTemplate('external_css_file_template',{external_file : self.parentController.appData.app.css.files[i] });
          $(iframe).contents().find('head').append(external_css);
        }
        $(iframe).contents().find('head').append(custom_css);
        //TODO null check
        for( var i = 0;i<self.parentController.appData.app.javascript.files.length;i++){
          var external_js = renderTemplate('external_javascript_file_template',{external_file : self.parentController.appData.app.javascript.files[i] });
          $(iframe).contents().find('head').append(external_js);
        }

        $(iframe).contents().find('head').append(custom_js);
        //mainJquery = document.getElementById('device_test_iframe').contentWindow.jQuery; 
        //mainJquery(document.getElementById('device_test_iframe').contentWindow.document).trigger('load');
        //alert(document.getElementById("device_test_iframe"));
        document.getElementById("device_test_iframe").contentWindow.reset();

      });
       
     };
     DeviceTestPage.prototype.destroy = function() {
       $('#device_test_iframe').remove();
     };

    return DeviceTestPage;
});
