# System dependencies

[`node-gyp`](node-gyp) is required on some platforms. See the documentation for [node-gyp](node-gyp) for installation instructions.

## Linux

Only Ubuntu is currently officially supported. lcjs-headless most likely works on other distributions but might require extra work.

### Ubuntu

Requirements:

- [Python 2.7](python2.7)
- GNU C++ environment (`build-essential` package from `apt`)
- [libxi-dev](libxi)
- OpenGl driver ([Mesa 3D](mesa))
- [Glew](glew)
- [pkg-config](pkg-config)

`$ sudo apt-get install -y build-essential libxi-dev libglu1-mesa-dev libglew-dev pkg-config`

See [headless-gl system dependencies](https://github.com/stackgl/headless-gl#system-dependencies) for more details.

## Windows

- [Python 2.7](python2.7)
- [Microsoft Visual Studio](vs)

## Browser

[node-gyp]: https://github.com/nodejs/node-gyp
[python2.7]: https://www.python.org/
[libxi]: https://www.x.org/wiki/
[glew]: http://glew.sourceforge.net/
[pkg-config]: https://www.freedesktop.org/wiki/Software/pkg-config/
[mesa]: https://mesa3d.org/
[vs]: https://visualstudio.microsoft.com/
