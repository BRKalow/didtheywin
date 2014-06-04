working_directory "/var/www/didtheywin"

pid "/var/www/didtheywin/pids/unicorn.pid"

stderr_path "/var/www/didtheywin/logs/unicorn.log"
stdout_path "/var/www/didtheywin/logs/unicorn.log"

listen "/tmp/unicorn.didtheywin.sock"

worker_processes 2

timeout 30
