default['pmsiplan']['packages'] = %w(git)
default['pmsiplan']['root'] = '/var/www/pmsiplan'

default['pmsiplan']['owner']['name'] = 'www-data'
default['pmsiplan']['owner']['home'] = '/var/www'

default['pmsiplan']['client']['root'] = node['pmsiplan']['root'] + '/client'
default['pmsiplan']['client']['bower']['components_dir'] = node['pmsiplan']['client']['root'] + '/bower_components'
default['pmsiplan']['client']['bower']['force_latest'] = true
default['pmsiplan']['client']['bower']['update'] = true
default['pmsiplan']['client']['bower']['allow_root'] = false

default['pmsiplan']['server']['root'] = node['pmsiplan']['root'] + '/server'
default['pmsiplan']['server']['alias'] = '/'
default['pmsiplan']['server']['port'] = 3700

default['pmsiplan']['apache2']['server_name'] = 'pmsiplan'
default['pmsiplan']['apache2']['doc_root'] = node['pmsiplan']['client']['root'] + '/public'
default['pmsiplan']['apache2']['directory_index'] = 'index.html'
