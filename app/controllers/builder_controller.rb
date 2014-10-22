class BuilderController < ApplicationController
  def show
    @iframe_host = "#{request.protocol}#{request.host_with_port}"
    if Rails.env.production?
      @iframe_host = "#{request.protocol}#{request.host}"
    end
  end
end
