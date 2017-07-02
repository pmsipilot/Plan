angular.module('plan').directive('projectDependancyGraph', ['$q', function ($q) {
    return {
        scope: {
            projects: '=projectDependancyGraph',
            projectsConfigInDelivery: '=projectConfigInDelivery'
        },
        link: function (scope, element) {

            var defer = $q.defer(),
                renderGraph = function (projects, projectsConfig) {
                    var
                        graph = {
                            nodes: [],
                            links: []
                        },
                        nodeKeys = {},
                        promises = [],
                        nodesByPrimaryKey = {};

                    defer = $q.defer();

                    angular.forEach(projectsConfig, function (projectsConfig,  key) {
                        nodeKeys[projectsConfig.primaryKey] = key;
                        nodesByPrimaryKey[projectsConfig.primaryKey] = { name: projectsConfig.name, group: 1, color: '#ccc' };
                        graph.nodes[key] = nodesByPrimaryKey[projectsConfig.primaryKey];
                    });

                    angular.forEach(projects, function (project) {
                        if (angular.isDefined(nodeKeys[project.getPrimaryKey()])) {
                            var defer = $q.defer();
                            project.getDependancies().then(function (dependancies) {
                                angular.forEach(dependancies, function (dependancy) {
                                    if (angular.isDefined(nodeKeys[dependancy.getPrimaryKey()])) {
                                        graph.links.push({
                                            source: nodeKeys[project.getPrimaryKey()],
                                            target: nodeKeys[dependancy.getPrimaryKey()],
                                            value: 1
                                        });
                                    }
                                });
                                defer.resolve();
                            }, function () {
                                defer.resolve();
                            });

                            promises.push(defer.promise);
                        }
                    });

                    angular.forEach(projectsConfig, function (config) {
                        if (config.primaryKey) {
                            var node = nodesByPrimaryKey[config.primaryKey];
                            node.color = '#993333';
                            if (config.status) {
                                if (config.status === 'delivered') {
                                    node.color = '#339933';
                                } else if (config.status === 'current') {
                                    node.color = '#ea9916';
                                }
                            }
                        }
                    });

                    $q.all(promises).then(function () {

                        defer.resolve();
                        element.empty();

                        var width = element.width(),
                            height = element.height(),
                            force = d3.layout.force()
                                .gravity(0)
                                .charge(-1)
                                .linkDistance(10)
                                .linkStrength(0)
                                .size([width, height]),
                            svg = d3.select('#' + element.attr('id')).append('svg')//better to keep the viewBox dimensions with variables
                                .attr('viewBox', '0 0 ' + width + ' ' + height)
                                .attr('preserveAspectRatio', 'xMidYMid meet');

                        svg.append('defs').append('marker')
                            .attr('id', 'arrowhead')
                            .attr('refX', 12 + 3) /*must be smarter way to calculate shift*/
                            .attr('refY', 4)
                            .attr('markerWidth', 16)
                            .attr('markerHeight', 16)
                            .attr('orient', 'auto')
                            .attr('class', 'marker')
                            .append('path')
                            .attr('d', 'M 0,0 V 8 L8,4 Z'); //this is actual shape for arrowhead

                        force
                            .nodes(graph.nodes)
                            .links(graph.links)
                            .start();

                        var link = svg.selectAll('.link')
                            .data(graph.links)
                            .enter().append('line')
                            .attr('class', 'link')
                            .style('stroke-width', function (d) { return Math.sqrt(d.value); })
                            .attr('marker-end', 'url(#arrowhead)');

                        var node = svg.selectAll('.node')
                            .data(graph.nodes);

                        var circle = node.enter().append('circle')
                            .attr('class', 'node')
                            .attr('r', 5)
                            .style('fill', function (d) { return d.color; })
                            .call(force.drag)
                            .on('mouseover', function (d) {
                                svg.selectAll('circle').style('opacity', 0.3);
                                svg.selectAll('text').style('opacity', 0.3);
                                svg.selectAll('.link').style('opacity', 0.3);
                                var nodeNeighbors = graph.links.filter(function (link) {
                                    return link.source.index === d.index || link.target.index === d.index;
                                })
                                .map(function (link) {
                                    return link.source.index === d.index ? link.target.index : link.source.index;
                                });

                                svg.selectAll('circle').filter(function (node) {
                                    return nodeNeighbors.indexOf(node.index) > -1;
                                }).style('opacity', 1);

                                svg.selectAll('text').filter(function (node) {
                                    return nodeNeighbors.indexOf(node.index) > -1;
                                }).style('opacity', 1);

                                d3.select(this).attr('r', 10).style('opacity', 1);
                                svg.selectAll('text').filter(function (node) {
                                    return node.index === d.index;
                                }).style('opacity', 1);

                                svg.selectAll('.link').filter(function (link) {
                                    return link.source.index === d.index || link.target.index === d.index;
                                }).style('opacity', 1);
                            })
                            .on('mouseout',  function (d) {
                                svg.selectAll('circle').style('opacity', 1);
                                svg.selectAll('text').style('opacity', 1);
                                svg.selectAll('line').style('opacity', 1);
                                d3.select(this).attr('r', 5);
                            });

                        var text = svg.append('g').selectAll('text')
                            .data(force.nodes())
                            .enter().append('text')
                            .attr('text-anchor', 'middle')
                            .text(function (d) { return d.name; });

                        force.on('tick', function () {
                            link.attr('x1', function (d) { return d.source.x; })
                                .attr('y1', function (d) { return d.source.y; })
                                .attr('x2', function (d) { return d.target.x; })
                                .attr('y2', function (d) { return d.target.y; });

                            circle.attr('cx', function (d) { return d.x; })
                                .attr('cy', function (d) { return d.y; });

                            text.attr('x', function (d) { return d.x; })
                                .attr('y', function (d) { return d.y + 20; });
                        });
                    });
                };

            defer.resolve();

            scope.$watch('projects', function () {
                defer.promise.then(function () {
                    renderGraph(scope.projects, scope.projectsConfigInDelivery);
                });
            }, true);

            scope.$watch('projectsConfigInDelivery', function () {
                defer.promise.then(function () {
                    renderGraph(scope.projects, scope.projectsConfigInDelivery);
                });
            }, true);
        }
    };
}]);
