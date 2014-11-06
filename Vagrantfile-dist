VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
    config.vm.box = "pmsiplan"
    config.vm.box_url = "./pmsiplan.box"
    config.vm.hostname = 'pmsiplan'

    config.vm.network :forwarded_port, guest: 80,   host: 2280
    config.vm.network :forwarded_port, guest: 3700, host: 3700

    # Gestion automatique du fichier /etc/hosts
    # Pour installer le plugin : vagrant plugin install vagrant-hostmanager
    #
    # config.hostmanager.enabled = true
    # config.hostmanager.manage_host = true

    # Gestion automatique des cookbooks Chef
    # Pour installer le plugin : vagrant plugin install vagrant-berkshelf
    # Si vous ne souhaitez/pouvez pas utiliser le plugin, utilisez le Makefile : make
    # Si vous utilisez le plugin, décommentez les lignes suivantes et lancez : make Vagrantfile && vagrant up
    #
    config.berkshelf.berksfile_path = './Berksfile'
    config.berkshelf.enabled = true

    config.vm.provider "virtualbox" do |vbox|
        vbox.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
    end

    config.vm.provision 'shell', inline: 'cat /etc/ssh/ssh_config | grep -q gitlab || echo -e "\n\nHost gitlab\n\tUserKnownHostsFile=/dev/null\n\tStrictHostKeyChecking=no" >> /etc/ssh/ssh_config'

    config.vm.provision :chef_solo do |chef|
        #chef.log_level = :debug
        chef.cookbooks_path = %w(vendor/cookbooks)
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
