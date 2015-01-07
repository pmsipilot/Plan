VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

    config.vm.network :forwarded_port, guest: 3700, host: 3700
    config.vm.provider "virtualbox" do |vbox|
        vbox.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
    end

    config.vm.define :dev do |dev|
        config.vm.box = "wgarcia/pmsiplan"
    end

    config.vm.define :build do |build|
        build.berkshelf.berksfile_path = './Berksfile'
        build.berkshelf.enabled = true
        build.vm.provision :chef_solo do |chef|
            #chef.log_level = :debug
            chef.cookbooks_path = %w(cookbooks)
            chef.run_list = %w(
                recipe[pmsiplan::service]
                recipe[pmsiplan::install]
                recipe[pmsiplan::apache2]
            )
            chef.json = {
                :pmsiplan => {
                    :root => '/vagrant',
                    :owner => {
                        :name => 'vagrant',
                        :home => '/home/vagrant'
                    }
                }
            }
        end
    end
end
