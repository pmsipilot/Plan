npm_package 'forever' do
  action :install
  not_if 'which forever'
end

template '/etc/init.d/pmsiplan' do
  source 'init.d.erb'
  mode '0744'
  variables ({
      :node => node
  })
end

service 'pmsiplan' do
  supports ({
    :status => true,
    :start => true,
    :stop => true,
    :restart => true,
    :reload => false
  })
  action :nothing
  subscribes :stop, "execute[install NPM packages from package.json at #{node['pmsiplan']['server']['root']}]", :immediately
  subscribes :start, "execute[install NPM packages from package.json at #{node['pmsiplan']['server']['root']}]", :delayed
end
