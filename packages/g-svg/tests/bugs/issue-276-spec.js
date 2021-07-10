const expect = require('chai').expect;
import Canvas from '../../src/canvas';
import Group from '../../src/group';

const dom = document.createElement('div');
document.body.appendChild(dom);
dom.id = 'c1';

describe('#276', () => {
  const canvas = new Canvas({
    container: dom,
    width: 600,
    height: 600,
  });

  it('should work correctly when group and shape are not mounted under canvas', () => {
    const group = new Group({});
    const shape = group.addShape('circle', {
      attrs: {
        x: 100,
        y: 100,
        r: 50,
        fill: 'red',
      },
    });
    // before mounted under canvas
    expect(shape.attr('fill')).eqls('red');
    expect(shape.get('el')).eqls(undefined);
    let bbox = shape.getBBox();
    expect(bbox.minX).eqls(50);
    expect(bbox.minY).eqls(50);
    expect(bbox.maxX).eqls(150);
    expect(bbox.maxY).eqls(150);
    expect(canvas.getChildren().length).eqls(0);
    // after mounted under canvas
    canvas.add(group);
    shape.attr('fill', 'blue');
    bbox = shape.getBBox();
    expect(bbox.minX).eqls(50);
    expect(bbox.minY).eqls(50);
    expect(bbox.maxX).eqls(150);
    expect(bbox.maxY).eqls(150);
    expect(shape.get('el')).not.eqls(undefined);
    expect(shape.attr('fill')).eqls('blue');
    expect(canvas.getChildren().length).eqls(1);
  });
});
