def drag_function(title):
    return """
    <script>
    //Make the DIV element draggagle:
    dragElement(document.getElementById(" """ + title + """ "));

    function dragElement(elmnt) {
      var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
      elmnt.onmousedown = dragMouseDown;

      function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
      }

      function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
      }

      function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
      }
    }
    </script>"""

def build_title(title):
    return """<div
     style="position:absolute;
     up: 50px; 
     left: 50px;
     border:1px solid black; 
     z-index: 9999;
     background-color: white;
     font-size:16px;">
     &nbsp;<b>&nbsp;&nbsp;""" + title + """&nbsp;&nbsp;</b>
     </div>"""

def build_legend(html_id, color, min_value, max_value):
    return f"""
    <div id = " {html_id} " 
        style="position:absolute;
        top: 40px; 
        left: 50px; 
        width: 5%; 
        height: 50%; 
        border:2px solid gray; 
        background-color: white;
        z-index: 9999;
        font-size:16px;
        text-align: center;">
        {max_value}
        <br />
        <svg width="60%" height="80%">
            <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:{color}; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:{color}; stop-opacity:0" />
                </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grad)"/>
        </svg>
        <br />
        {min_value}
     </div>"""


def build_legend_colors(html_id, colors):
    legend = f"""
    <div id = " {html_id} " 
        style="position:absolute;
        top: 40px; 
        left: 50px; 
        padding: 10px 10px 10px 10px;
        border:2px solid gray; 
        background-color: white;
        z-index: 9999;
        font-size:12px;">
        """
    for c in colors:
      legend += f"""
        <svg width="10px" height="10px">
        <rect width="100%" height="100%" style="fill:{c[0]};" /></svg>&nbsp;{c[1]}<br>
        """
    legend += """</div>"""
    return legend