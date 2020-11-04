import { AfterViewInit, Component, OnInit } from '@angular/core';
import { forEach as _forEach, isEmpty as _isEmpty, cloneDeep as _cloneDeep } from 'lodash';

import Canvg from 'canvg';
import { fabric } from "fabric";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'SVG-To-PNG';

  data = [
    {
      "name": "EUR: 36745",
      "value": 40632
    },
    {
      "name": "CHF: 36745",
      "value": 50000
    },
    {
      "name": "GBP: 36745",
      "value": 36745
    },
    {
      "name": "USD: 36240",
      "value": 36240
    },
    {
      "name": "OTHERS: 36240",
      "value": 33000
    }
  ];

  ManagementChartConfig: any = {
    gradient: false,
    legend: false,
    labels: false,
    doughnut: true,
    arcWidth: 0.4,
    schemeActive: {
      domain: ['#A11C36', '#EA6B75', '#F7C3C6', '#FFDBDA', '#FFF3F2']
    },
    schemeCompleted: {
      domain: ['#DE822B', '#E99852', '#F2AE77', '#FAC49C', '#FFE3CF']
    },
    schemeCanceled: {
      domain: ['#6D1874', '#7E4991', '#966EA7', '#B295C0', '#D0C1DA']
    }
  };

  fileList = []

  drawSvg(): void {
    this.fileList = [];
    setTimeout(() => {
      const ngxCharts = document.getElementById('hiddenChart');
      const svg = ngxCharts.querySelectorAll('svg');

      _forEach(svg, s => {
        let data = (new XMLSerializer()).serializeToString(s);
        // data = data.replace(/xmlns=\"http:\/\/www\.w3\.org\/2000\/svg\"/, ''); 
        const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });

        const img = new Image();
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
          const canvas = document.querySelectorAll('canvas')[0];
          canvas.setAttribute('width', '500');
          canvas.setAttribute('height', '500');
          const ctx = canvas.getContext('2d');

          ctx.fillStyle = 'white';
          ctx.drawImage(img, 10, 10);
          URL.revokeObjectURL(url);

          const imgData = canvas.toDataURL().replace('data:image/png;base64,', '');
          const bs = atob(imgData);
          const buffer = new ArrayBuffer(bs.length);
          const ba = new Uint8Array(buffer);
          for (let i = 0; i < bs.length; i++) {
            ba[i] = bs.charCodeAt(i);
          }
          const filex = new Blob([ba], { type: 'image/jpg' });
          filex['lastModifiedDate'] = new Date();
          filex['name'] = 'Chart.jpg';
          this.fileList.push(filex);
        };
        img.crossOrigin = 'Anonymous';
        img.src = url;
      });
    }, 3000);
  }

  drawSvgIE() {
    setTimeout(() => {

      const ngxCharts = document.getElementById('hiddenChart');
      const svg = ngxCharts.querySelectorAll('svg');

      _forEach(svg, (s, i) => {
        let data = (new XMLSerializer()).serializeToString(s);
        data = data.replace(/xmlns=\"http:\/\/www\.w3\.org\/2000\/svg\"/, '');
        const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        const canvas = new fabric.Canvas('chart', { backgroundColor: "#fff" });
        canvas.setDimensions({ width: 600, height: 600 });


        fabric.loadSVGFromURL(url, (objects, options) => {
          var object = fabric.util.groupSVGElements(objects, options);
          object.set({
            left: 0,
            top: 0,
            width: 550,
            height: 500
          });

          canvas.add(object);
          canvas.setActiveObject(object);
          canvas.centerObject(object);
          object.setCoords();
          canvas.renderAll();

          var dataUrl = canvas.toDataURL({ format: "jpeg" });

          const img = document.querySelectorAll('img')[i];
          img.src = dataUrl;
        });
      });

    }, 1000)
  }

  ngOnInit(): void {
    // this.drawSvg();
    // this.drawSvgIE();
  }

  ngAfterViewInit(): void {
    // this.drawSvgIE();
    this.drawSvg();
  }
}
