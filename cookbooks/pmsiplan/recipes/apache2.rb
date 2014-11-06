include_recipe 'apache2::default'
include_recipe 'apache2::mod_proxy'
include_recipe 'apache2::mod_proxy_http'

web_app 'pmsiplan' do
  template 'pmsiplan.conf.erb'
  server_name node['hostname']
  server_aliases [node['fqdn'], node['pmsiplan']['apache2']['server_name']]
  docroot node['pmsiplan']['apache2']['doc_root']
  directory_index node['pmsiplan']['apache2']['directory_index']
end
