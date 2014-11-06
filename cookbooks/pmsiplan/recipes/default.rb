include_recipe 'apt'

node['pmsiplan']['packages'].each do |package|
  package package
end

include_recipe 'pmsiplan::mongodb'
include_recipe 'pmsiplan::nodejs'
include_recipe 'pmsiplan::service'
include_recipe 'pmsiplan::install'
include_recipe 'pmsiplan::apache2'
