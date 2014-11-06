npm_package 'bower' do
  action :install
  not_if 'which bower'
end

npm_package 'grunt-cli' do
  action :install
  not_if 'which grunt'
end

npm_package 'pmsiplan-client' do
  path node['pmsiplan']['client']['root']
  action :install_from_json
end

env = {
    'HOME' => node['pmsiplan']['owner']['home'],
    'USER' => node['pmsiplan']['owner']['name']
}

args = ''
if node['pmsiplan']['client']['bower']['force_latest']
  args = '-F'
end

if node['pmsiplan']['client']['bower']['allow_root']
  args = args + ' --allow-root'
end

execute 'bower-update' do
  command "bower update #{args}"
  environment (env)
  user node['pmsiplan']['owner']['name']
  cwd node['pmsiplan']['client']['root']
  retries 3
  only_if do
    File.directory?(node['pmsiplan']['client']['bower']['components_dir']) && node['pmsiplan']['client']['bower']['update']
  end
end

execute 'bower-install' do
  command "bower install #{args}"
  environment (env)
  user node['pmsiplan']['owner']['name']
  cwd node['pmsiplan']['client']['root']
  retries 3
  not_if do
    File.directory?(node['pmsiplan']['client']['bower']['components_dir'])
  end
end

execute 'grunt' do
  command 'grunt'
  environment (env)
  user node['pmsiplan']['owner']['name']
  cwd node['pmsiplan']['client']['root']
end
