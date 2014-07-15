# config valid only for Capistrano 3.1
lock '3.2.1'

require "capistrano/bundler"
require "capistrano/rvm"

set :application, 'didtheywin'
set :repo_url, 'git@github.com:BRkalow/didtheywin.git'
set :deploy_to, "/var/www/#{fetch(:application)}"
set :scm, :git

set :format, :pretty
set :log_level, :debug
set :pty, true

set :linked_dirs, %w{bin log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system}
set :linked_files, %w{config/app.yml}

set :unicorn_config_path, "#{fetch(:deploy_to)}/current/unicorn.rb"
set :unicorn_pid, "#{fetch(:deploy_to)}/pids/unicorn.pid"

namespace :deploy do

  desc 'Start application'
  task :start do
    on roles(:app), in: :sequence, wait: 5 do
       invoke 'unicorn:start'
       execute "service nginx start"
    end
  end

  desc 'Stop application'
  task :stop do
    on roles(:app), in: :sequence, wait: 5 do
      invoke 'unicorn:stop' 
    end 
  end

  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      invoke 'unicorn:restart'
      execute :sudo, "service nginx restart"
    end
  end

  after :publishing, :restart

end
