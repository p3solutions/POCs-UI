import { Component, OnInit, Input } from '@angular/core';
import * as d3 from '../../assets/d3.v4.min.js';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  // @Input() selectorClass: string;
  svg;
  margin;
  width;
  height;
  x;
  y;
  g;
  barChartdata = '../assets/bar-chart-data.csv';
  currentTarget: HTMLElement;
  constructor() { }

  ngOnInit() {
    const _component = this;
    _component.svg = d3.select('svg');
    _component.margin = 200;
    _component.width = _component.svg.attr('width') - _component.margin;
    _component.height = _component.svg.attr('height') - _component.margin;
    _component.svg.append('text')
       .attr('transform', 'translate(100,0)')
       .attr('x', 50).attr('y', 50)
       .attr('font-size', '20px')
       .attr('class', 'title')
       .text('Population bar chart');
    _component.x = d3.scaleBand().range([0, _component.width]).padding(0.4);
    _component.y = d3.scaleLinear().range([_component.height, 0]);
    _component.g = _component.svg.append('g')
     .attr('transform', 'translate(' + 100 + ',' + 100 + ')');
    d3.csv(_component.barChartdata, function(error, data) {
      // console.log('csv', error, data);
      if (error) {
        throw error;
      }
      _component.x.domain(data.map(function(d) { return d.year; }));
      _component.y.domain([0, d3.max(data, function(d) { return d.population; })]);
      _component.g.append('g')
        .attr('transform', 'translate(0,' + _component.height + ')')
        .call(d3.axisBottom(_component.x))
        .append('text')
        .attr('y', _component.height - 250)
        .attr('x', _component.width - 100)
        .attr('text-anchor', 'end')
        .attr('font-size', '18px')
        .attr('stroke', 'blue').text('year');
      _component.g.append('g')
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '-5.1em')
        .attr('text-anchor', 'end')
        .attr('font-size', '18px')
        .attr('stroke', 'blue')
        .text('population');
      _component.g.append('g')
        .attr('transform', 'translate(0, 0)')
        .call(d3.axisLeft(_component.y));
      _component.g.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .on('mouseover', onMouseOver)
        .on('mouseout', onMouseOut)
        .attr('x', function(d) { return _component.x(d.year); })
        .attr('y', function(d) { return _component.y(d.population); })
        .attr('width', _component.x.bandwidth()).transition()
        .ease(d3.easeLinear).duration(200)
        .delay(function (d, i) {
           return i * 25;
        })
     .attr('height', function(d) { return _component.height - _component.y(d.population); });
    });

    const onMouseOver = (d, i) => {
      // console.log('onMouseOver', d, i, _component.currentTarget);
      d3.select(_component.currentTarget)
        .attr('class', 'highlight');
      d3.select(_component.currentTarget)
        .transition()
        .duration(200)
        .attr('width', _component.x.bandwidth() + 5)
        .attr('y', function(data: any) { return _component.y(data.population) - 10; })
        .attr('height', function(data: any) { return _component.height - _component.y(data.population) + 10; });
      _component.g.append('text')
        .attr('class', 'val')
        .attr('x', function() {
            return _component.x(d.year);
        })
        .attr('y', function() {
          return _component.y(d.value) - 10;
        });
    };

    const onMouseOut = (d, i, _thisArray) => {
      // console.log('onMouseOut', d, i, _thisArray, _component.currentTarget);
       d3.select(_component.currentTarget)
          .attr('class', 'bar');
       d3.select(_component.currentTarget)
        .transition()
        .duration(200)
        .attr('width', _component.x.bandwidth())
        .attr('y', function(data) { return _component.y(data.population); })
        .attr('height', function(data) { return _component.height - _component.y(data.population); });
      d3.selectAll('.val')
        .remove();
    };
  }

  clicked(_event) {
    this.currentTarget = _event.target;
  }

}
