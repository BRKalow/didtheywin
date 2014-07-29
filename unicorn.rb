working_directory "/var/www/didtheywin/current"

pid "/var/www/didtheywin/pids/unicorn.pid"

stderr_path "/var/www/didtheywin/logs/unicorn.log"
stdout_path "/var/www/didtheywin/logs/unicorn.log"

listen "/tmp/unicorn.didtheywin.sock"
worker_processes 2
timeout 30

preload_app true

before_exec do |server|
    ENV['BUNDLE_GEMFILE'] ="/var/www/didtheywin/current/Gemfile"
end

before_fork do |server, worker|
    old_pid = "#{server.pid}.oldbin"
    if File.exists?(old_pid) && server.pid != old_pid
        begin
            Process.kill("QUIT", File.read(old_pid).to_i)
        rescue Errno::ENOENT, Errno::ESRCH
            # Done already
        end
    end
end
