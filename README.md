# Super simple sketcher

This is a super simple sketcher/sketchpad 

<br>
Work in progress, have to clean the mess and improve many things<br><br>

<img  src="https://nokol.net/sketch.jpg" />

<a href="https://nokol.net/sketcher"> Demo </a>

## Usage

!Made quick and dirty!

create a base 

```
    <diV style="max-width: 700px;">
        <div id="palette"> // req

            <div id="susi-general" style="position: absolute; right: 0px;z-index: 1 ;">
                <div class="picker" acp-color="#EFE9E7">
                </div>
            </div>
        </div>

        <div id="container" style="overflow:hidden; max-width:700px;max-height:450px; height:40vh;"></div> // req
        <div id="images-container"></div> // req
    </diV>

```

and call

```
new SuSiSketch()
```


## Licence
MIT you can do what ever you want