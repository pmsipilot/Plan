angular.module('plan').directive('projectDependencyGraph', [function () {
    return {
        scope: {
            projects: '=',
            deliveries: '='
        },
        link: function ($scope, $element) {
            var id = 0;
            var nodes = $scope.projects
                .map(function (project) {
                    var version = $scope.deliveries.find(function (delivery) {
                        return delivery.project === project._id;
                    });

                    return {
                        id: project._id,
                        index: id++,
                        name: project.name,
                        color: project.color,
                        status: version ? version.status : null,
                        version: version ? version.version : null
                    };
                });
            var links = $scope.deliveries.reduce(function (prev, delivery) {
                var project = $scope.projects.find(function (proj) {
                    return proj._id === delivery.project;
                });

                var dependencies = [];

                project.dependancies.forEach(function (dependency) {
                    dependencies.push({
                        source: nodes.find(function (node) {
                            return node.id === delivery.project;
                        }).index,
                        target: nodes.find(function (node) {
                            return node.id === dependency;
                        }).index
                    });
                });

                return prev.concat(dependencies);
            }, nodes.reduce(function (prev, node) {
                var dependencies = [];

                if (!node.version) {
                    var project = $scope.projects.find(function (proj) {
                        return node.id === proj._id;
                    });

                    project.dependancies.forEach(function (dependency) {
                        dependencies.push({
                            source: node.index,
                            target: nodes.find(function (n) {
                                return n.id === dependency;
                            }).index
                        });
                    });
                }

                return prev.concat(dependencies);
            }, []));

            var vis = d3.select('#graph-dependancy')
                .append('svg:svg')
                .attr('width', '100%')
                .attr('height', '99%')
                .attr('viewBox', '0 0 ' + $element.find('svg').width() + ' ' + $element.find('svg').height())
                .attr('preserveAspectRatio', 'xMidYMid meet');

            vis.append('defs')
                .append('marker')
                .attr('id', 'arrowhead')
                .attr('refX', 27)
                .attr('refY', 4)
                .attr('markerWidth', 16)
                .attr('markerHeight', 16)
                .attr('orient', 'auto')
                .attr('class', 'marker')
                .append('path')
                .attr('d', 'M 0,0 V 8 L8,4 Z');

            var force = d3.layout.force()
                .gravity(0)
                .charge(-1)
                .linkDistance(200)
                .nodes(nodes)
                .links(links)
                .size([$element.find('svg').width(), $element.find('svg').height()])
                .start();

            var link = vis.selectAll('line.link')
                .data(links)
                .enter()
                .append('svg:line')
                .attr('class', 'link')
                .style('stroke-width', 1)
                .attr('x1', function (d) { return d.source.x - 5; })
                .attr('y1', function (d) { return d.source.y - 5; })
                .attr('x2', function (d) { return d.target.x - 5; })
                .attr('y2', function (d) { return d.target.y - 5; })
                .attr('marker-end', 'url(#arrowhead)');

            var text = vis.append('g').selectAll('text')
                .data(nodes)
                .enter()
                .append('text')
                .attr('text-anchor', 'middle')
                .text(function (d) { return d.name + (d.version ? ' ' + d.version : ''); });

            var stroke = vis.selectAll('circle.stroke')
                .data(nodes)
                .enter()
                .append('svg:circle')
                .attr('class', 'stroke')
                .attr('cx', function (d) { return d.x; })
                .attr('cy', function (d) { return d.y; })
                .attr('r', 15)
                .style('fill', 'white')
                .style('stroke-width', 5)
                .style('stroke-dasharray', function (d) {
                    return d.version ? '' : '5, 5';
                })
                .style('stroke', function (d) {
                    switch (d.status) {
                        case 'blocked':
                            return '#d9534f';

                        case 'delivered':
                            return '#5cb85c';

                        case 'current':
                            return '#f0ad4e';

                        case 'planned':
                            return '#5bc0de';

                        default:
                            return '#CCC';
                    }
                });

            var node = vis.selectAll('circle.node')
                .data(nodes)
                .enter()
                .append('svg:circle')
                .attr('class', 'node')
                .attr('cx', function (d) { return d.x; })
                .attr('cy', function (d) { return d.y; })
                .attr('r', 10)
                .style('fill', function (d) { return d.color; })
                .on('mouseover', function (d) {
                    vis.selectAll('circle')
                        .transition()
                        .duration(250)
                        .style('opacity', 0.15);
                    vis.selectAll('text')
                        .transition()
                        .duration(250)
                        .style('opacity', 0.15);
                    vis.selectAll('line')
                        .transition()
                        .duration(250)
                        .style('opacity', 0.15);

                    var neighbors = [];

                    vis.selectAll('line')
                        .filter(function (n) {
                            if (n.source.index === d.index || n.target.index === d.index) {
                                neighbors.push(n.source.index);
                                neighbors.push(n.target.index);

                                return true;
                            }

                            return false;
                        })
                        .transition()
                        .duration(0)
                        .style('opacity', 1);

                    vis.selectAll('circle')
                        .filter(function (n) {
                            return neighbors.indexOf(n.index) > -1;
                        })
                        .transition()
                        .duration(0)
                        .style('opacity', 1);

                    vis.selectAll('text')
                        .filter(function (n) {
                            return neighbors.indexOf(n.index) > -1;
                        })
                        .transition()
                        .duration(0)
                        .style('opacity', 1);
                })
                .on('mouseout', function () {
                    vis.selectAll('circle')
                        .transition()
                        .duration(250)
                        .style('opacity', 1);
                    vis.selectAll('text')
                        .transition()
                        .duration(250)
                        .style('opacity', 1);
                    vis.selectAll('line')
                        .transition()
                        .duration(250)
                        .style('opacity', 1);
                })
                .call(force.drag);

            vis.style('opacity', 1e-6)
                .transition()
                .duration(1000)
                .style('opacity', 1);

            force.on('tick', function () {
                link.attr('x1', function (d) { return d.source.x; })
                    .attr('y1', function (d) { return d.source.y; })
                    .attr('x2', function (d) { return d.target.x; })
                    .attr('y2', function (d) { return d.target.y; });

                node.attr('cx', function (d) { return d.x; })
                    .attr('cy', function (d) { return d.y; });

                stroke.attr('cx', function (d) { return d.x; })
                    .attr('cy', function (d) { return d.y; });

                text.attr('x', function (d) { return d.x; })
                    .attr('y', function (d) { return d.y + 35; });
            });
        },
        template: '<div id="graph-dependancy"></div>'
    };
}]);
