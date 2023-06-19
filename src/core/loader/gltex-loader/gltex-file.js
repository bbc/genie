import { WebGLTextureUtil } from "./webgl-texture-util.js";

export class GltexFile extends Phaser.Loader.File {
    constructor(loader, fileConfig, xhrSettings, dataKey) {
        super(loader, Object.assign(fileConfig, { type: "gltex" }));

        const defaults = {
            //cache: loader.cacheManager.image,
            //extension: "ktx",
            responseType: "blob",
            xhrSettings: xhrSettings,
            config: dataKey,
        };

        Object.assign(fileConfig, defaults);

        Phaser.Loader.File.call(this, loader, fileConfig);
    }

    /**
     * Called automatically by Loader.nextFile.
     * This method controls what extra work this File does with its loaded data.
     *
     * @method Phaser.Loader.FileTypes.JSONFile#onProcess
     * @since 3.7.0
     */
    onProcess() {
        //const loader = new BasisTextureLoader();

        this.xhrLoader.response.arrayBuffer().then(buffer => {
            //const text = new KhronosTextureContainer(buffer)

            //this.data = new KhronosTextureContainer(buffer).mipmaps(false)[0].data

            //gl.glCompressedTexImage2D(GL10.GL_TEXTURE_2D, 0, ETC1.ETC1_RGB8_OES, m_TexWidth, m_TexHeight, 0, etc1tex.getData().capacity(), etc1tex.getData());

            //gl.compressedTexImage2D

            //this.loader.scene.game.renderer.gl.compressedTexImage2D

            const textureUtil = new WebGLTextureUtil(this.loader.scene.game.renderer.gl, true);

            let file = this

            //TODO loading twice I think - check if textureUtil has parse function and pass buffer?

            textureUtil.loadTexture(this.src, null, function (texture, error, stats) {
                //debugger;
                //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                //gl.bindTexture(gl.TEXTURE_2D, texture);
                //gl.drawArrays(gl.TRIANGLES, 0, 6);

                //var dataUrl = canvas.toDataURL();
                //texElem.style.backgroundImage = "url(" + dataUrl + ")";

                //file.data = texture;

                file.loader.scene.textures.addGLTexture(file.key, texture, stats.width, stats.height);


                file.onProcessComplete();
            });

            //var gl = WebGLUtil.getContext(canvas);

            //this.loader.scene.textures.addGLTexture("BBXXBB", this.data, 512, 512);
        });
    }
}
