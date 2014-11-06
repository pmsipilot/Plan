npm_package 'grunt-cli' do
  action :install
  not_if 'which grunt'
end

npm_package 'pmsiplan-server' do
  path node['pmsiplan']['server']['root']
  action :install_from_json
end
