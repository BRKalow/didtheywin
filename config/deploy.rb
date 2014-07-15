# config valid only for Capistrano 3.1
lock '3.2.1'

require "bundler/capistrano"

set :application, 'didtheywin'
set :repo_url, 'git@github.com/brkalow/didtheywin.git'

set :deploy_to, '/var/www/#{application}'
set :scm, :git

set :format, :pretty
set :log_level, :debug

set :linked_dirs, %w{bin log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system}
set :default_env, { path: "$HOME/.rbenv/shims:$HOME/.rbenv/bin:$PATH" }

set :unicorn_config, "#{deploy_to}/unicorn.rb"
set :unicorn_pid, "#{deploy_to}/pids/unicorn.pid"

namespace :deploy do

  desc 'Start application'
  task :start do
    on roles(:app), in :sequence, wait: 5 do
      run "cd #{deploy_to} && unicorn -c #{unicorn_config} -D"
    end
  end

  desc 'Stop application'
  task :stop do
    on roles(:app), in :sequence, wait: 5 do
      run "sudo kill `cat #{unicorn_pid}`"
    end 
  end

  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      run "sudo kill -s USR2 `cat #{unicorn_pid}`; sudo service nginx restart"
    end
  end

  after :publishing, :restart

end
