require 'yaml'

module Settings

  extend self

  @_settings = {}
  attr_reader = :_settings

  def load!(filename)
    newsets = YAML::load_file(filename)
    @_settings.merge! newsets
  end

  def method_missing(name, *args, &block)
    @_settings["#{name}"] || fail(NoMethodError, "Unknown configuration root #{name}", caller)
  end

end
