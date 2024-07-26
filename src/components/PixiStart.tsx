// import './App.css'
import { useEffect, useRef } from 'react'
import { Application, Assets, Sprite } from 'pixi.js';
import bunnyPng from '../assets/bunny.png'

function PIXIStart() {
    const ref = useRef<HTMLDivElement>(null)
    const init = async () => {
        const app = new Application();
        await app.init({ background: '#1099bb', resizeTo: window });

        // 当元素存在时候，且没有子元素时候，添加canvas，能够保证每次只渲染一次app.canvas
        if (ref.current && !ref.current.hasChildNodes()) {
            ref.current.appendChild(app.canvas);
        }


        const texture = await Assets.load(bunnyPng);
        const bunny = new Sprite(texture);

        app.stage.addChild(bunny);

        bunny.anchor.set(0.5);

        bunny.x = app.screen.width / 2;
        bunny.y = app.screen.height / 2;

        app.ticker.add((time) => {
            bunny.rotation += 0.1 * time.deltaTime;
        });

    }

    useEffect(() => { init() }, [])
    return (
        <div ref={ref}></div>
    )
}

export default PIXIStart;
