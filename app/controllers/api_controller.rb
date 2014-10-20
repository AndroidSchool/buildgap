class ApiController < ApplicationController
  def getData
    contents = JSON.parse(File.read('lib/assets/data.json'))
    respond_to do |format|
      format.json { render json: contents }
    end
  end
end
