builderApp.factory('PageTabbedFooter',function($http){
    var PageTabbedFooter = function(devicePage){
      //TODO null check for device page
      this.devicePage = devicePage;
      this.jQuery = null;
      this.pageContents = null;
      this.data = null;
      console.log("Setting up page tabbed_footer");
    }
    PageTabbedFooter.prototype.load = function(page_bg_uniq_id,jquery,pageContents,data,triggerCreate,cb){
      if(this.data !== null || this.data != undefined){
        console.log("TabbedFooter already has data");
        alert('A tabbed_footer already exists. Try Deleting it and readd a new tabbed_footer');
        cb(null);
        return;
      }
      if(nullOrUndefined(data)){
        console.log('TabbedFooter data is undefined');

        cb(null);
        return;
      }
      //TODO check if the tabbedFooterHtml is already present
      //this should not really happen that data is not present and the tabbed_footer html is present
      // but we need to check to be sure
      this.jQuery  = jquery;
      this.pageContents = pageContents;
      this.data = data;
      this.page_bg_uniq_id = page_bg_uniq_id;
      this.jQuery('[data-bg-uniq-id="' + page_bg_uniq_id +'"]').append(getTabbedFooterHtml(this.data));
      if(triggerCreate === true){
        //This is a hack dont know the reasons
        this.jQuery(this.jQuery('[data-bg-uniq-id="' + page_bg_uniq_id +'"]')).trigger('create');
      }

      //this.setupControls();
      cb(); 
    }
    PageTabbedFooter.prototype.setupControls = function() {
      var self = this;
      if(nullOrUndefined(self.data) || nullOrUndefined(self.pageContents)){
        return;
      }
      self.pageContents.find('[data-bg-uniq-id="' + self.data.bg_uniq_id +'"]').click(function(event){
       event.stopPropagation();
       self.devicePage.activateWidget(self.data.bg_uniq_id);
     });
    };
    PageTabbedFooter.prototype.unsetControls = function() {
      var self = this;
      if(!nullOrUndefined(self.pageContents)){
        self.pageContents.find('[data-bg-uniq-id="' + self.data.bg_uniq_id +'"]').off('click');
      }
    };

    PageTabbedFooter.prototype.isWidget = function(updatedWidgetData) {
      var self = this;
      if(self.data.bg_uniq_id === updatedWidgetData.bg_uniq_id){
        return true;
      } else {
        return false;
      }

    };
    PageTabbedFooter.prototype.destroyWidget = function() {
      var self = this;
      self.jQuery('[data-bg-uniq-id="' + self.data.bg_uniq_id +'"]').remove();
    };
    PageTabbedFooter.prototype.redrawWidget = function(updatedWidgetData) {
      var self = this;
      self.jQuery('[data-bg-uniq-id="' + self.page_bg_uniq_id +'"]').append(getTabbedFooterHtml(self.data))
      self.jQuery(self.jQuery('[data-bg-uniq-id="' + self.page_bg_uniq_id +'"]')).trigger('create');
    };
    PageTabbedFooter.prototype.updateWidgetUI = function(updatedWidgetData) {
      var self = this;
      if(nullOrUndefined(updatedWidgetData)){
        console.log("Trying to update widget with null data");
        return;
      }
      self.data = updatedWidgetData;
      self.destroyWidget();
      self.redrawWidget();
      
      self.setupControls();
      
    };

    PageTabbedFooter.prototype.deleteWidget = function(updatedWidgetData) {
      var self = this;
      if(self.isWidget(updatedWidgetData)){
        self.destroyWidget();
        self.data = null;
        self.setupControls();
      } else {
        //TODO complete this logic

      }
    };
    //TODO we can make this common
    PageTabbedFooter.prototype.getUpdatedHtml = function() {
      var self = this;
      if(nullOrUndefined(self.data)){
        return null
      } else {
        return getTabbedFooterHtml(self.data)
      }

    };

    return PageTabbedFooter;
});
