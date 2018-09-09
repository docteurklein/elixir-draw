import socket from './socket'
import {paper, Path, PointText, Point} from 'paper'

document.addEventListener('DOMContentLoaded', () => {
    let channel = socket.channel("draw", {})
    channel.join()
      .receive("ok", resp => { console.log("Joined successfully", resp) })
      .receive("error", resp => { console.log("Unable to join", resp) })

    paper.install(window);
    paper.setup(document.getElementById('draw'));
    var path;

    var tool = new Tool();
    tool.onMouseDown = (event) => {
        if (path) {
            path.selected = false;
        }

        path = new Path({
            segments: [event.point],
            strokeColor: 'black',
        });
    }

    tool.onMouseDrag = (event) => {
        path.add(event.point);
    }

    tool.onMouseUp = (event) => {
        path.simplify(10);
        channel.push('drawn', {body: path.exportJSON({asString: false})});
    }

    channel.on("drawn", msg => {
        console.log(msg);
        let drawnPath = new Path();
        drawnPath.importJSON(msg.body);
    });
});
