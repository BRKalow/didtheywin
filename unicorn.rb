working_directory "/var/www/didtheywin"

pid "/var/www/didtheywin/pids/unicorn.pid"
old_pid "#{pid}.oldbin"

stderr_path "/var/www/didtheywin/logs/unicorn.log"
stdout_path "/var/www/didtheywin/logs/unicorn.log"

listen "/tmp/unicorn.didtheywin.sock"
worker_processes 2
timeout 30

preload_app true

before_exec do |server|
    ENV['BUNDLE_GEMFILE'] = File.expand_path('../Gemfile', File.dirname(__FILE__))
end

before_fork do |server, worker|
    if File.exists?(old_pid) && server.pid != old_pid
        begin
            Process.kill("QUIT", File.read(old_pid).to_i)
        rescue Errno::ENOENT, Errno::ESRCH
            # Done already
        end
    end
end
