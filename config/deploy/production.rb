# Simple Role Syntax
# ==================
# Supports bulk-adding hosts to roles, the primary server in each group
# is considered to be the first unless any hosts have the primary
# property set.  Don't declare `role :all`, it's a meta role.

role :app, %w{bryce@107.170.144.174}
role :web, %w{bryce@107.170.144.174}
role :db,  %w{bryce@107.170.144.174}
