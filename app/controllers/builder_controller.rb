class BuilderController < ApplicationController
  def show
    @iframe_host = "http://192.168.1.2:3000"
    if Rails.env.production?
      @iframe_host = "http://buildgap.com"
    end
  end
end
