import{e}from"./namespace-BzafXSza.D48SLZaH.js";import{v,o as z,l as P}from"./DC.Billboard-BZoEwlNv.CwdX4HI9.js";class A extends P{constructor(){super(),this._registerEvent()}_registerEvent(){for(let i in DC.EffectEventType){let r=DC.EffectEventType[i];this._eventCache[r]=new e.Event}}}DC.GlobeRotate=class{constructor(t,i=5,r,a){this._viewer=t,this._time=i,this._callback=r,this._startRotate();let o=setTimeout(()=>{this._endRotate(),this._callback&&this._callback.call(a||this),clearTimeout(o)},Number(this._time)*1e3)}_icrf(t,i){if(t.mode!==e.SceneMode.SCENE3D)return;let r=e.Transforms.computeIcrfToFixedMatrix(i);if(e.defined(r)){let a=this._viewer.delegate.camera,o=e.Cartesian3.clone(a.position),s=e.Matrix4.fromRotationTranslation(r);a.lookAtTransform(s,o)}}_startRotate(){this._viewer.delegate.camera.lookAtTransform(e.Matrix4.IDENTITY),this._viewer.delegate.clock.multiplier=12*1e3,this._viewer.delegate.scene.postUpdate.addEventListener(this._icrf,this)}_endRotate(){this._viewer.delegate.camera.lookAtTransform(e.Matrix4.IDENTITY),this._viewer.delegate.clock.multiplier=1,this._viewer.delegate.clock.currentTime=e.JulianDate.now().clone(),this._viewer.delegate.scene.postUpdate.removeEventListener(this._icrf,this)}};DC.AroundView=class{constructor(t,i={}){this._viewer=t,this._options=i,this._heading=t.camera.heading,this._startTime=e.JulianDate.fromDate(new Date),this._stopTime=e.JulianDate.addSeconds(this._startTime,this._options.duration||10,new e.JulianDate)}_start(){this._viewer.clock.startTime=this._startTime.clone(),this._viewer.clock.stopTime=this._stopTime.clone(),this._viewer.clock.currentTime=this._startTime.clone(),this._viewer.clock.onTick.addEventListener(this._onTickHandler,this)}_onTickHandler(){let t=e.JulianDate.secondsDifference(this._viewer.clock.currentTime,this._viewer.clock.startTime),i=this._options.duration||10,r=e.Math.toRadians(t*(360/i))+this._heading;this._viewer.scene.camera.setView({orientation:{heading:r}}),e.JulianDate.compare(this._viewer.clock.currentTime,this._viewer.clock.stopTime)>=0&&(this._viewer.clock.onTick.removeEventListener(this._onTickHandler,this),this._options._callback&&this._options._callback.call(this._options.context||this))}};DC.AroundPoint=class{constructor(t,i,r={}){if(!i||!(i instanceof DC.Position))throw new Error("the position invalid");this._viewer=t,this._position=i,this._options=r,this._heading=t.camera.heading,this._startTime=e.JulianDate.fromDate(new Date),this._stopTime=e.JulianDate.addSeconds(this._startTime,this._options.duration||10,new e.JulianDate)}_start(){this._viewer.clock.startTime=this._startTime.clone(),this._viewer.clock.stopTime=this._stopTime.clone(),this._viewer.clock.currentTime=this._startTime.clone(),this._viewer.clock.onTick.addEventListener(this._onTickHandler,this)}_onTickHandler(){let t=e.JulianDate.secondsDifference(this._viewer.clock.currentTime,this._viewer.clock.startTime),i=this._options.duration||10,r=e.Math.toRadians(t*(360/i))+this._heading;this._viewer.scene.camera.setView({destination:DC.T.transformWSG84ToCartesian(this._position),orientation:{heading:r,pitch:e.Math.toRadians(this._options.pitch||0)}}),this._options.distance&&this._viewer.scene.camera.moveBackward(this._options.distance),e.JulianDate.compare(this._viewer.clock.currentTime,this._viewer.clock.stopTime)>=0&&(this._viewer.clock.onTick.removeEventListener(this._onTickHandler,this),this._options._callback&&this._options._callback.call(this._options.context||this))}};const k={resolution:1,material:new e.PolylineGlowMaterialProperty({glowPower:.1,color:e.Color.YELLOW}),width:10};DC.Roaming=class{constructor(t,i){this._viewer=t,this._positions=[],this._modelPath=i.modelPath,this._modelScale=i.modelScale||1,this._modelShow=i.modelShow||!0,this._time=i.time||360,this._startTime=void 0,this._endTime=void 0,this._showPath=i.showPath||!1,this._delegate=new e.Entity,this._perspective=i.perspective||0,this._parsePositions(i.positions)}_parsePositions(t){if(typeof t=="string"){if(t.indexOf("#")>=0)throw new Error("the positions invalid");t=t.split(";")}this._positions=t.map(i=>Array.isArray(i)?DC.Position.fromCoordArray(i):i instanceof DC.Position?i:DC.Position.fromCoordString(i))}_preparePositionProperty(){var t=new e.SampledPositionProperty;if(this._positions.length){let i=this._time-this._time%this._positions.length;this._startTime=e.JulianDate.now();let r=i/this._positions.length;this._endTime=e.JulianDate.addSeconds(this._startTime,i,new e.JulianDate),this._positions.forEach((a,o)=>{let s=e.JulianDate.addSeconds(this._startTime,o*r,new e.JulianDate);t.addSample(s,DC.T.transformWSG84ToCartesian(a))})}return t}_prepareDelegate(){let t=this._preparePositionProperty();this._delegate.merge({position:t,orientation:new e.VelocityOrientationProperty(t),model:{uri:this._modelPath,scale:this._modelScale,show:this._modelShow},path:{...k,show:this._showPath}}),this._startTime&&this._endTime&&(this._delegate.availability=new e.TimeIntervalCollection([new e.TimeInterval({start:this._startTime,stop:this._endTime})])),this._delegate.position.setInterpolationOptions({interpolationDegree:5,interpolationAlgorithm:e.LagrangePolynomialApproximation})}_setClock(){this._viewer.delegate.clock.startTime=this._startTime.clone(),this._viewer.delegate.clock.stopTime=this._endTime.clone(),this._viewer.delegate.clock.currentTime=this._startTime.clone()}setSpeed(t){this._viewer.delegate.clock.multiplier=t}setPerspective(t){this._perspective=t,this._delegate.model&&(t===0?this._viewer.delegate.trackedEntity=this._delegate:t===1&&(this._viewer.delegate.trackedEntity=void 0,this._viewer.delegate.zoomTo(this._delegate,new e.HeadingPitchRange(0,e.Math.toRadians(-90)))))}reset(){this._prepareDelegate(),this._setClock(),this._viewer.delegate.clock.multiplier=1}start(){this._viewer.delegate.entities.remove(this._delegate),this._prepareDelegate(),this._setClock(),this._viewer.delegate.entities.add(this._delegate)}stop(){this._viewer.delegate.entities.remove(this._delegate),this._viewer.delegate.clock.multiplier=1,this._viewer.delegate.trackedEntity=void 0}};class m{constructor(i){this._viewer=i.viewer,this._plotEvent=i.plotEvent,this._layer=i.layer,this._delegate=new e.Entity}_mouseClickHandler(){}_mouseMoveHandler(){}_mouseDbClickHandler(){}_bindEvent(){this._viewer.on(e.ScreenSpaceEventType.LEFT_CLICK,this._mouseClickHandler,this),this._viewer.on(e.ScreenSpaceEventType.MOUSE_MOVE,this._mouseMoveHandler,this),this._viewer.on(e.ScreenSpaceEventType.LEFT_DOUBLE_CLICK,this._mouseDbClickHandler,this)}_unbindEnvet(){this._viewer.off(e.ScreenSpaceEventType.LEFT_CLICK,this._mouseClickHandler,this),this._viewer.off(e.ScreenSpaceEventType.MOUSE_MOVE,this._mouseMoveHandler,this),this._viewer.off(e.ScreenSpaceEventType.LEFT_DOUBLE_CLICK,this._mouseDbClickHandler,this)}_prepareDelegate(){}start(){this._bindEvent(),this._prepareDelegate()}}const I={pixelSize:10,outlineColor:e.Color.BLUE,outlineWidth:5};class S extends m{constructor(i,r){super(i),this._position=e.Cartesian3.ZERO,this._style={...I,...r}}_mouseClickHandler(i){this._position=i.surfacePosition,this._unbindEnvet(),this._plotEvent.raiseEvent({type:DC.OverlayType.POINT,points:[DC.T.transformCartesianToWSG84(this._position)]})}_mouseMoveHandler(i){this._viewer.tooltip.setContent("单击选择点位"),this._position=i.surfacePosition,this._viewer.tooltip.setPosition(this._position)}_prepareDelegate(){this._delegate.position=new e.CallbackProperty(i=>this._position),this._delegate.point={...this._style},this._layer.entities.add(this._delegate)}}const O={width:3,material:e.Color.BLUE.withAlpha(.6)};class L extends m{constructor(i,r){super(i),this._tempLine=new e.Entity,this._positions=[],this._tempPoints=[],this._style={...O,...r}}_mouseClickHandler(i){let r=i.surfacePosition;r&&this._positions.push(r)}_mouseMoveHandler(i){this._viewer.tooltip.setContent("单击选择点位,双击结束");let r=i.surfacePosition;this._viewer.tooltip.setPosition(r),r&&this._positions.length>0&&(this._viewer.tooltip.setPosition(r),this._tempPoints=[this._positions[this._positions.length-1],r])}_mouseDbClickHandler(i){this._unbindEnvet(),this._positions.length>2&&(this._positions=this._positions.slice(0,-1)),this._plotEvent.raiseEvent({type:DC.OverlayType.POLYLINE,points:DC.T.transformCartesianArrayToWSG84Array(this._positions)})}_prepareDelegate(){this._delegate.polyline={positions:new e.CallbackProperty(i=>this._positions),...this._style},this._tempLine.polyline={positions:new e.CallbackProperty(i=>this._tempPoints),...this._style},this._layer.entities.add(this._delegate),this._layer.entities.add(this._tempLine)}}const W={material:e.Color.BLUE.withAlpha(.6)};class w extends m{constructor(i,r){super(i),this._hierarchy=new e.PolygonHierarchy,this._positions=[],this._tempPoints=[],this._style={...W,...r}}_mouseClickHandler(i){let r=i.surfacePosition;r&&(this._positions.length===2&&(this._delegate.polyline.show=!1),this._positions.push(r),this._hierarchy.positions=this._positions)}_mouseMoveHandler(i){this._viewer.tooltip.setContent("单击选择点位,双击结束");let r=i.surfacePosition;this._viewer.tooltip.setPosition(r),r&&this._positions.length>0&&(this._tempPoints=[this._positions[this._positions.length-1],r],this._hierarchy.positions=[...this._positions,r])}_mouseDbClickHandler(i){this._unbindEnvet(),this._positions.length>2&&(this._positions=this._positions.slice(0,-1)),this._plotEvent.raiseEvent({type:DC.OverlayType.POLYGON,points:DC.T.transformCartesianArrayToWSG84Array(this._positions)})}_prepareDelegate(){this._delegate.polygon={hierarchy:new e.CallbackProperty(i=>this._hierarchy),...this._style},this._delegate.polyline={positions:new e.CallbackProperty(i=>this._tempPoints),...this._style},this._layer.entities.add(this._delegate)}}const R={width:3,material:e.Color.BLUE.withAlpha(.6)};class x extends m{constructor(i,r){super(i),this._center=e.Cartesian3.ZERO,this._radius=0,this._style={...R,...r}}_mouseClickHandler(i){let r=i.surfacePosition;r&&this._center===e.Cartesian3.ZERO?this._center=r:(this._computeRadius(this._center,r),this._unbindEnvet(),this._plotEvent.raiseEvent({type:DC.OverlayType.CIRCLE,points:[DC.T.transformCartesianToWSG84(this._center)],radius:this._radius}))}_mouseMoveHandler(i){this._viewer.tooltip.setContent("单击选择点位");let r=i.surfacePosition;this._viewer.tooltip.setPosition(r),r&&this._center!==e.Cartesian3.ZERO&&this._computeRadius(this._center,r)}_computeRadius(i,r){let a=e.Cartographic.fromCartesian(i),o=e.Cartographic.fromCartesian(r),s=new e.EllipsoidGeodesic;s.setEndPoints(a,o);let _=s.surfaceDistance;this._radius=Math.sqrt(Math.pow(_,2)+Math.pow(o.height-a.height,2))}_prepareDelegate(){this._delegate.position=new e.CallbackProperty(i=>this._center),this._delegate.ellipse={semiMajorAxis:new e.CallbackProperty(i=>this._radius),semiMinorAxis:new e.CallbackProperty(i=>this._radius),...this._style},this._delegate.point={pixelSize:10,outlineColor:e.Color.RED,outlineWidth:3},this._layer.entities.add(this._delegate)}}const V={material:e.Color.BLUE.withAlpha(.6)};class D extends m{constructor(i,r){super(i),this._coordinates=new e.Rectangle,this._positions=[],this._style={...V,...r}}_mouseClickHandler(i){let r=i.surfacePosition;r&&(this._positions.push(r),this._positions.length===2&&(this._coordinates=e.Rectangle.fromCartesianArray(this._positions,e.Ellipsoid.WGS84),this._unbindEnvet(),this._plotEvent.raiseEvent({type:DC.OverlayType.RECT,points:DC.T.transformCartesianArrayToWSG84Array(this._positions)})))}_mouseMoveHandler(i){this._viewer.tooltip.setContent("单击选择点位");let r=i.surfacePosition;r&&(this._viewer.tooltip.setPosition(r),this._coordinates=e.Rectangle.fromCartesianArray([...this._positions,r],e.Ellipsoid.WGS84))}_prepareDelegate(){this._delegate.rectangle={coordinates:new e.CallbackProperty(i=>this._coordinates),...this._style},this._layer.entities.add(this._delegate)}}class T{constructor(i){this._viewer=i.viewer,this._plotEvent=i.plotEvent,this._layer=i.layer,this._overlay=i.overlay,this._markers=[],this._currentMarker=void 0}_mouseClickHandler(){}_mouseMoveHandler(){}_mouseDbClickHandler(){}_bindEvent(){}_unbindEnvet(){}_createMarker(){}_prepareMarkers(){}start(){this._prepareMarkers()}}class N extends T{constructor(i){super(i),this._position=this._overlay.position}_mouseClickHandler(i){this._position=this._viewer.delegate.scene.camera.pickEllipsoid(i.position,Cesium.Ellipsoid.WGS84),this._unbindEnvet(),this._plotEvent.raiseEvent({type:DC.OverlayType.POINT,points:[DC.T.transformCartesianToWSG84(this._position)]})}_mouseMoveHandler(i){this._viewer.tooltip.setContent("单击选择点位"),this._position=this._viewer.delegate.scene.camera.pickEllipsoid(i.endPosition,Cesium.Ellipsoid.WGS84),this._viewer.tooltip.setPosition(this._position)}}class F extends T{constructor(i){super(i),this._positions=this._overlay.positions}_mouseClickHandler(i){}_mouseMoveHandler(i){}_prepareMarkers(){this._positions.forEach(i=>{let r=new DC.Point(i);this._layer.addOverlay(r)})}}DC.Plot=class{constructor(t){this._viewer=t,this._plotEvent=new e.Event,this._callback=void 0,this._drawWorker=void 0,this._editWorker=void 0,this._drawLayer=new e.CustomDataSource("plot-draw-layer"),this._viewer.delegate.dataSources.add(this._drawLayer),this._markerLayer=new DC.VectorLayer("plot-marker-layer"),this._viewer.addLayer(this._markerLayer),this._state=void 0}_completeCallback(t){this._drawWorker=void 0,this._editWorker=void 0,this._viewer.tooltip.enable=!1,this._state==="draw"&&this._drawLayer.entities.removeAll(),this._state==="edit"&&this._markerLayer.clear(),this._callback&&this._callback.call(this,t)}_bindEvent(t){this._plotEvent.removeEventListener(this._completeCallback,this),this._callback=t,this._plotEvent.addEventListener(this._completeCallback,this)}_createDrawWorker(t,i){let r={viewer:this._viewer,plotEvent:this._plotEvent,layer:this._drawLayer};switch(t){case DC.OverlayType.POINT:this._drawWorker=new S(r,i);break;case DC.OverlayType.POLYLINE:this._drawWorker=new L(r,i);break;case DC.OverlayType.POLYGON:this._drawWorker=new w(r,i);break;case DC.OverlayType.CIRCLE:this._drawWorker=new x(r,i);break;case DC.OverlayType.RECT:this._drawWorker=new D(r,i);break}}_createEditWorker(t){let i={viewer:this._viewer,plotEvent:this._plotEvent,layer:this._markerLayer,overlay:t};switch(t.type){case DC.OverlayType.POINT:this._editWorker=new N(i);break;case DC.OverlayType.POLYLINE:this._editWorker=new F(i);break;case DC.OverlayType.POLYGON:this._drawWorker=new w(i,style);break;case DC.OverlayType.CIRCLE:this._drawWorker=new x(i,style);break;case DC.OverlayType.RECT:this._drawWorker=new D(i,style);break}}draw(t,i,r){this._state="draw",this._viewer.tooltip.enable=!0,this._bindEvent(i),this._createDrawWorker(t,r),this._drawWorker&&this._drawWorker.start()}edit(t,i){this._state="edit",this._viewer.tooltip.enable=!0,this._bindEvent(i),this._createEditWorker(t),this._editWorker&&this._editWorker.start()}};var B=`uniform vec4 color;
uniform float duration;

czm_material czm_getMaterial(czm_materialInput materialInput){
    czm_material material = czm_getDefaultMaterial(materialInput);
    vec2 st = materialInput.st;
    float t =fract(czm_frameNumber / duration);
    t *= 1.03;
    float alpha = smoothstep(t- 0.03, t, st.s) * step(-t, -st.s);
    alpha += 0.1;
    material.diffuse = color.rgb;
    material.alpha = alpha;
    return material;
}`,H=`uniform sampler2D image;
 uniform float duration;
 uniform vec4 color;

czm_material czm_getMaterial(czm_materialInput materialInput){
   czm_material material = czm_getDefaultMaterial(materialInput);
   vec2 st = materialInput.st;
   float time = fract(czm_frameNumber / duration);
   vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));
   material.alpha = colorImage.a * color.a;
   material.diffuse = (colorImage.rgb + color.rgb)/2.0;
   return material;
}`,q=`vec3 _czm_permute289(vec3 x)
{
    return mod((34.0 * x + 1.0) * x, 289.0);
}

/**
 * DOC_TBA
 *
 * Implemented by Stefan Gustavson, and distributed under the MIT License.  {@link http:
 *
 * @name czm_cellular
 * @glslFunction
 *
 * @see Stefan Gustavson's chapter, <i>Procedural Textures in GLSL</i>, in <a href="http:
 */
vec2 czm_cellular(vec2 P)

{
#define K 0.142857142857 
#define Ko 0.428571428571 
#define jitter 1.0 
    vec2 Pi = mod(floor(P), 289.0);
    vec2 Pf = fract(P);
    vec3 oi = vec3(-1.0, 0.0, 1.0);
    vec3 of = vec3(-0.5, 0.5, 1.5);
    vec3 px = _czm_permute289(Pi.x + oi);
    vec3 p = _czm_permute289(px.x + Pi.y + oi); 
    vec3 ox = fract(p*K) - Ko;
    vec3 oy = mod(floor(p*K),7.0)*K - Ko;
    vec3 dx = Pf.x + 0.5 + jitter*ox;
    vec3 dy = Pf.y - of + jitter*oy;
    vec3 d1 = dx * dx + dy * dy; 
    p = _czm_permute289(px.y + Pi.y + oi); 
    ox = fract(p*K) - Ko;
    oy = mod(floor(p*K),7.0)*K - Ko;
    dx = Pf.x - 0.5 + jitter*ox;
    dy = Pf.y - of + jitter*oy;
    vec3 d2 = dx * dx + dy * dy; 
    p = _czm_permute289(px.z + Pi.y + oi); 
    ox = fract(p*K) - Ko;
    oy = mod(floor(p*K),7.0)*K - Ko;
    dx = Pf.x - 1.5 + jitter*ox;
    dy = Pf.y - of + jitter*oy;
    vec3 d3 = dx * dx + dy * dy; 
    
    vec3 d1a = min(d1, d2);
    d2 = max(d1, d2); 
    d2 = min(d2, d3); 
    d1 = min(d1a, d2); 
    d2 = max(d1a, d2); 
    d1.xy = (d1.x < d1.y) ? d1.xy : d1.yx; 
    d1.xz = (d1.x < d1.z) ? d1.xz : d1.zx; 
    d1.yz = min(d1.yz, d2.yz); 
    d1.y = min(d1.y, d1.z); 
    d1.y = min(d1.y, d2.x); 
    return sqrt(d1.xy);
}`,j=`vec4 _czm_mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 _czm_mod289(vec3 x)
{
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 _czm_mod289(vec2 x)
{
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

float _czm_mod289(float x)
{
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 _czm_permute(vec4 x)
{
    return _czm_mod289(((x*34.0)+1.0)*x);
}

vec3 _czm_permute(vec3 x)
{
    return _czm_mod289(((x*34.0)+1.0)*x);
}

float _czm_permute(float x)
{
    return _czm_mod289(((x*34.0)+1.0)*x);
}

vec4 _czm_taylorInvSqrt(vec4 r)
{
    return 1.79284291400159 - 0.85373472095314 * r;
}

float _czm_taylorInvSqrt(float r)
{
    return 1.79284291400159 - 0.85373472095314 * r;
}

vec4 _czm_grad4(float j, vec4 ip)
{
    const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
    vec4 p,s;

    p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
    p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
    s = vec4(lessThan(p, vec4(0.0)));
    p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;

    return p;
}

/**
 * DOC_TBA
 *
 * Implemented by Ian McEwan, Ashima Arts, and distributed under the MIT License.  {@link https:
 *
 * @name czm_snoise
 * @glslFunction
 *
 * @see <a href="https:
 * @see Stefan Gustavson's paper <a href="http:
 */
float czm_snoise(vec2 v)
{
    const vec4 C = vec4(0.211324865405187,  
                        0.366025403784439,  
                       -0.577350269189626,  
                        0.024390243902439); 
    
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);

    
    vec2 i1;
    
    
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    
    
    
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;

    
    i = _czm_mod289(i); 
    vec3 p = _czm_permute( _czm_permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;

    
    
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    
    
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

    
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

float czm_snoise(vec3 v)
{
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;

    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    
    
    
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; 
    vec3 x3 = x0 - D.yyy;      

    
    i = _czm_mod289(i);
    vec4 p = _czm_permute( _czm_permute( _czm_permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    
    
    float n_ = 0.142857142857; 
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    
    vec4 norm = _czm_taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}

float czm_snoise(vec4 v)
{
    const vec4  C = vec4( 0.138196601125011,  
                          0.276393202250021,  
                          0.414589803375032,  
                         -0.447213595499958); 

    
    #define F4 0.309016994374947451

    
    vec4 i  = floor(v + dot(v, vec4(F4)) );
    vec4 x0 = v -   i + dot(i, C.xxxx);

    

    
    vec4 i0;
    vec3 isX = step( x0.yzw, x0.xxx );
    vec3 isYZ = step( x0.zww, x0.yyz );
    
    i0.x = isX.x + isX.y + isX.z;
    i0.yzw = 1.0 - isX;
    
    i0.y += isYZ.x + isYZ.y;
    i0.zw += 1.0 - isYZ.xy;
    i0.z += isYZ.z;
    i0.w += 1.0 - isYZ.z;

    
    vec4 i3 = clamp( i0, 0.0, 1.0 );
    vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
    vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

    
    
    
    
    
    vec4 x1 = x0 - i1 + C.xxxx;
    vec4 x2 = x0 - i2 + C.yyyy;
    vec4 x3 = x0 - i3 + C.zzzz;
    vec4 x4 = x0 + C.wwww;

    
    i = _czm_mod289(i);
    float j0 = _czm_permute( _czm_permute( _czm_permute( _czm_permute(i.w) + i.z) + i.y) + i.x);
    vec4 j1 = _czm_permute( _czm_permute( _czm_permute( _czm_permute (
               i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
             + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
             + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
             + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

    
    
    vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

    vec4 p0 = _czm_grad4(j0,   ip);
    vec4 p1 = _czm_grad4(j1.x, ip);
    vec4 p2 = _czm_grad4(j1.y, ip);
    vec4 p3 = _czm_grad4(j1.z, ip);
    vec4 p4 = _czm_grad4(j1.w, ip);

    
    vec4 norm = _czm_taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    p4 *= _czm_taylorInvSqrt(dot(p4,p4));

    
    vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
    vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
    m0 = m0 * m0;
    m1 = m1 * m1;
    return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
                  + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;
}`,G=`uniform vec4 asphaltColor;
uniform float bumpSize;
uniform float roughness;

czm_material czm_getMaterial(czm_materialInput materialInput){
  czm_material material = czm_getDefaultMaterial(materialInput);

  
  
  vec4 color = asphaltColor;
  vec2 st = materialInput.st;
  vec2 F = czm_cellular(st / bumpSize);
  color.rgb -= (F.x / F.y) * 0.1;

  
  float noise = czm_snoise(st / bumpSize);
  noise = pow(noise, 5.0) * roughness;
  color.rgb += noise;

  material.diffuse = color.rgb;
  material.alpha = color.a;

  return material;
}`,E=`uniform vec4 lightColor;
uniform vec4 darkColor;
uniform float frequency;

czm_material czm_getMaterial(czm_materialInput materialInput){
  czm_material material = czm_getDefaultMaterial(materialInput);

  
  vec2 F = czm_cellular(materialInput.st * frequency);
  float t = 1.0 - F.x * F.x;

  vec4 color = mix(lightColor, darkColor, t);
  material.diffuse = color.rgb;
  material.alpha = color.a;

  return material;
}`,U=`uniform vec4 cementColor;
uniform float grainScale;
uniform float roughness;

czm_material czm_getMaterial(czm_materialInput materialInput){
  czm_material material = czm_getDefaultMaterial(materialInput);

  float noise = czm_snoise(materialInput.st / grainScale);
  noise = pow(noise, 5.0) * roughness;

  vec4 color = cementColor;
  color.rgb += noise;

  material.diffuse = color.rgb;
  material.alpha = color.a;

  return material;
}`,Z=`uniform vec4 color;
uniform float time;

czm_material czm_getMaterial(czm_materialInput materialInput){
  czm_material material = czm_getDefaultMaterial(materialInput);
  float alpha = 1.0;
  if (time != 1.0)
  {
      float t = 0.5 + (0.5 * czm_snoise(materialInput.str / (1.0 / 10.0)));   

      if (t > time)
      {
          alpha = 0.0;
      }
  }

  material.diffuse = color.rgb;
  material.alpha = color.a * alpha;

  return material;
}`,K=`uniform vec4 lightColor;
uniform vec4 darkColor;
uniform float frequency;

czm_material czm_getMaterial(czm_materialInput materialInput){
  czm_material material = czm_getDefaultMaterial(materialInput);

  
  vec2 F = czm_cellular(materialInput.st * frequency);
  float t = 0.1 + (F.y - F.x);

  vec4 color = mix(lightColor, darkColor, t);
  material.diffuse = color.rgb;
  material.alpha = color.a;

  return material;
}`,Y=`czm_material czm_getMaterial(czm_materialInput materialInput){
  czm_material material = czm_getDefaultMaterial(materialInput);

  vec3 normalWC = normalize(czm_inverseViewRotation * material.normal);
  vec3 positionWC = normalize(czm_inverseViewRotation * materialInput.positionToEyeEC);
  float cosAngIncidence = max(dot(normalWC, positionWC), 0.0);

  material.diffuse = mix(reflection.diffuse, refraction.diffuse, cosAngIncidence);

  return material;
}`,J=`uniform vec4 grassColor;
uniform vec4 dirtColor;
uniform float patchiness;

czm_material czm_getMaterial(czm_materialInput materialInput){
  czm_material material = czm_getDefaultMaterial(materialInput);

  vec2 st = materialInput.st;
  float noise1 = (czm_snoise(st * patchiness * 1.0)) * 1.0;
  float noise2 = (czm_snoise(st * patchiness * 2.0)) * 0.5;
  float noise3 = (czm_snoise(st * patchiness * 4.0)) * 0.25;
  float noise = sin(noise1 + noise2 + noise3) * 0.1;

  vec4 color = mix(grassColor, dirtColor, noise);

  
  float verticalNoise = czm_snoise(vec2(st.x * 100.0, st.y * 20.0)) * 0.02;
  float horizontalNoise = czm_snoise(vec2(st.x * 20.0, st.y * 100.0)) * 0.02;
  float stripeNoise = min(verticalNoise, horizontalNoise);

  color.rgb += stripeNoise;

  material.diffuse = color.rgb;
  material.alpha = color.a;

  return material;
}`,X=`uniform samplerCube cubeMap;

czm_material czm_getMaterial(czm_materialInput materialInput){
  czm_material material = czm_getDefaultMaterial(materialInput);

  vec3 normalWC = normalize(czm_inverseViewRotation * material.normal);
  vec3 positionWC = normalize(czm_inverseViewRotation * materialInput.positionToEyeEC);
  vec3 reflectedWC = reflect(positionWC, normalWC);
  material.diffuse = textureCube(cubeMap, reflectedWC).channels;

  return material;
}`,Q=`uniform samplerCube cubeMap;
uniform float indexOfRefractionRatio;

czm_material czm_getMaterial(czm_materialInput materialInput){
  czm_material material = czm_getDefaultMaterial(materialInput);

  vec3 normalWC = normalize(czm_inverseViewRotation * material.normal);
  vec3 positionWC = normalize(czm_inverseViewRotation * materialInput.positionToEyeEC);
  vec3 refractedWC = refract(positionWC, -normalWC, indexOfRefractionRatio);
  material.diffuse = textureCube(cubeMap, refractedWC).channels;

  return material;
}`,$=`uniform vec4 lightColor;
uniform vec4 darkColor;
uniform float frequency;

czm_material czm_getMaterial(czm_materialInput materialInput){
  czm_material material = czm_getDefaultMaterial(materialInput);

  vec3 scaled = materialInput.str * frequency;
  float t = abs(czm_snoise(scaled));

  vec4 color = mix(lightColor, darkColor, t);
  material.diffuse = color.rgb;
  material.alpha = color.a;

  return material;
}`,ee=`uniform vec4 lightWoodColor;
uniform vec4 darkWoodColor;
uniform float ringFrequency;
uniform vec2 noiseScale;
uniform float grainFrequency;

czm_material czm_getMaterial(czm_materialInput materialInput){
  czm_material material = czm_getDefaultMaterial(materialInput);

  
  vec2 st = materialInput.st;

  vec2 noisevec;
  noisevec.x = czm_snoise(st * noiseScale.x);
  noisevec.y = czm_snoise(st * noiseScale.y);

  vec2 location = st + noisevec;
  float dist = sqrt(location.x * location.x + location.y * location.y);
  dist *= ringFrequency;

  float r = fract(dist + noisevec[0] + noisevec[1]) * 2.0;
  if(r > 1.0)
      r = 2.0 - r;

  vec4 color = mix(lightWoodColor, darkWoodColor, r);

  
  r = abs(czm_snoise(vec2(st.x * grainFrequency, st.y * grainFrequency * 0.02))) * 0.2;
  color.rgb += lightWoodColor.rgb * r;

  material.diffuse = color.rgb;
  material.alpha = color.a;

  return material;
}`,te=`uniform vec4 color;
uniform float duration;

czm_material czm_getMaterial(czm_materialInput materialInput){
  czm_material material = czm_getDefaultMaterial(materialInput);
  material.diffuse = 1.5 * color.rgb;
  vec2 st = materialInput.st;
  float dis = distance(st, vec2(0.5, 0.5));
  float per = fract(czm_frameNumber / duration);
  if(dis > per * 0.5){
   discard;
  }else {
    material.alpha = color.a  * dis / per / 2.0;
  }
  return material;
}`,ie=`uniform vec4 color;
uniform float duration;
uniform float count;
uniform float gradient;

czm_material czm_getMaterial(czm_materialInput materialInput)
{
  czm_material material = czm_getDefaultMaterial(materialInput);
  material.diffuse = 1.5 * color.rgb;
  vec2 st = materialInput.st;
  vec3 str = materialInput.str;
  float dis = distance(st, vec2(0.5, 0.5));
  float per = fract(czm_frameNumber / duration );
  if(abs(str.z)>0.001){
    discard;
  }
  if(dis >0.5){
    discard;
  }else {
    float perDis = 0.5 / count;
    float disNum;
    float bl = .0;
    for(int i=0;i<=10;i++){
      if(float(i)<=count){
        disNum = perDis*float(i) - dis + per/count;
        if(disNum>0.0){
          if(disNum<perDis){
            bl = 1.0-disNum/perDis;
          }else if(disNum-perDis<perDis){
            bl = 1.0 - abs(1.0-disNum/perDis);
          }
          material.alpha = pow(bl,gradient);
        }
      }
    }
  }
  return material;
}`,re=`uniform vec4 color;

czm_material czm_getMaterial(czm_materialInput materialInput){
    czm_material material = czm_getDefaultMaterial(materialInput);
    vec4 fragColor = color;
    fragColor = czm_gammaCorrect(fragColor);
    material.emission = fragColor.rgb;
    material.diffuse = fragColor.rgb;
    material.alpha = color.a;
    return material;
}`;const ae="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAAgCAYAAABkS8DlAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAADSSURBVHja7NYxEoUgDEDBYM39z2qHtZViwMFxt1FJnF/98ZXWWkRE7LWWOOt5Lsm9q/vsbu9Zdtazs/J19O5bs1XPZrwze/6V31zxbOZs1n905Wt2p3f25GzE7ohv6q3nLQCA3xEAACAAAAABAAAIAABAAAAAAgAAEAAAgAAAAAQAACAAAAABAAAIAABAAAAAAgAAEAAAgAAAAAQAACAAAEAAAAACAAAQAACAAAAABAAAIAAAAAEAAAgAAEAAAAACAAAQAACAAAAA8g4AAAD//wMA4WEFTJOT5UIAAAAASUVORK5CYII=";let oe=B,se=H,le=q,ne=j,ce=G,he=E,_e=E,de=U,pe=Z,me=K,ue=Y,ve=J,ye=X,fe=Q,Ce=$,ge=ee,we=te,xe=ie;e.ShaderSource._czmBuiltinsAndUniforms.czm_cellular=le;e.ShaderSource._czmBuiltinsAndUniforms.czm_snoise=ne;e.Material.PolylineEmissionType="PolylineEmission";e.Material._materialCache.addMaterial(e.Material.PolylineEmissionType,{fabric:{type:e.Material.PolylineEmissionType,uniforms:{color:new e.Color(1,0,0,.7)},source:re},translucent:function(t){return!0}});e.Material.PolylineFlowType="PolylineFlow";e.Material._materialCache.addMaterial(e.Material.PolylineFlowType,{fabric:{type:e.Material.PolylineFlowType,uniforms:{color:new e.Color(1,0,0,.7),duration:45},source:oe},translucent:function(t){return!0}});e.Material.PolylineTrailType="PolylineTrail";e.Material._materialCache.addMaterial(e.Material.PolylineTrailType,{fabric:{type:e.Material.PolylineTrailType,uniforms:{color:new e.Color(1,0,0,.7),image:ae,duration:45},source:se},translucent:function(t){return!0}});e.Material.AsphaltType="Asphalt";e.Material._materialCache.addMaterial(e.Material.AsphaltType,{fabric:{type:e.Material.AsphaltType,uniforms:{asphaltColor:new e.Color(.15,.15,.15,1),bumpSize:.02,roughness:.2},source:ce},translucent:function(t){return t.uniforms.asphaltColor.alpha<1}});e.Material.BlobType="Blob";e.Material._materialCache.addMaterial(e.Material.BlobType,{fabric:{type:e.Material.BlobType,uniforms:{lightColor:new e.Color(1,1,1,.5),darkColor:new e.Color(0,0,1,.5),frequency:10},source:he},translucent:function(t){var i=t.uniforms;return i.lightColor.alpha<1||i.darkColor.alpha<0}});e.Material.BrickType="Brick";e.Material._materialCache.addMaterial(e.Material.BrickType,{fabric:{type:e.Material.BrickType,uniforms:{brickColor:new e.Color(.6,.3,.1,1),mortarColor:new e.Color(.8,.8,.7,1),brickSize:new e.Cartesian2(.3,.15),brickPct:new e.Cartesian2(.9,.85),brickRoughness:.2,mortarRoughness:.1},source:_e},translucent:function(t){var i=t.uniforms;return i.brickColor.alpha<1||i.mortarColor.alpha<1}});e.Material.CementType="Cement";e.Material._materialCache.addMaterial(e.Material.CementType,{fabric:{type:e.Material.CementType,uniforms:{cementColor:new e.Color(.95,.95,.85,1),grainScale:.01,roughness:.3},source:de},translucent:function(t){return t.uniforms.cementColor.alpha<1}});e.Material.ErosionType="Erosion";e.Material._materialCache.addMaterial(e.Material.ErosionType,{fabric:{type:e.Material.ErosionType,uniforms:{color:new e.Color(1,0,0,.5),time:1},source:pe},translucent:function(t){return t.uniforms.color.alpha<1}});e.Material.FacetType="Facet";e.Material._materialCache.addMaterial(e.Material.FacetType,{fabric:{type:e.Material.FacetType,uniforms:{lightColor:new e.Color(.25,.25,.25,.75),darkColor:new e.Color(.75,.75,.75,.75),frequency:10},source:me},translucent:function(t){var i=t.uniforms;return i.lightColor.alpha<1||i.darkColor.alpha<0}});e.Material.FresnelType="Fresnel";e.Material._materialCache.addMaterial(e.Material.FresnelType,{fabric:{type:e.Material.FresnelType,materials:{reflection:{type:e.Material.ReflectionType},refraction:{type:e.Material.RefractionType}},source:ue},translucent:!1});e.Material.GrassType="Grass";e.Material._materialCache.addMaterial(e.Material.GrassType,{fabric:{type:e.Material.GrassType,uniforms:{grassColor:new e.Color(.25,.4,.1,1),dirtColor:new e.Color(.1,.1,.1,1),patchiness:1.5},source:ve},translucent:function(t){var i=t.uniforms;return i.grassColor.alpha<1||i.dirtColor.alpha<1}});e.Material.ReflectionType="Reflection";e.Material._materialCache.addMaterial(e.Material.ReflectionType,{fabric:{type:e.Material.ReflectionType,uniforms:{cubeMap:e.Material.DefaultCubeMapId,channels:"rgb"},source:ye},translucent:!1});e.Material.RefractionType="Refraction";e.Material._materialCache.addMaterial(e.Material.RefractionType,{fabric:{type:e.Material.RefractionType,uniforms:{cubeMap:e.Material.DefaultCubeMapId,channels:"rgb",indexOfRefractionRatio:.9},source:fe},translucent:!1});e.Material.TyeDyeType="TieDye";e.Material._materialCache.addMaterial(e.Material.TyeDyeType,{fabric:{type:e.Material.TyeDyeType,uniforms:{lightColor:new e.Color(1,1,0,.75),darkColor:new e.Color(1,0,0,.75),frequency:5},source:Ce},translucent:function(t){var i=t.uniforms;return i.lightColor.alpha<1||i.darkColor.alpha<0}});e.Material.WoodType="Wood";e.Material._materialCache.addMaterial(e.Material.WoodType,{fabric:{type:e.Material.WoodType,uniforms:{lightWoodColor:new e.Color(.6,.3,.1,1),darkWoodColor:new e.Color(.4,.2,.07,1),ringFrequency:3,noiseScale:new e.Cartesian2(.7,.5),grainFrequency:27},source:ge},translucent:function(t){var i=t.uniforms;return i.lightWoodColor.alpha<1||i.darkWoodColor.alpha<1}});e.Material.CircleFadeType="CircleFade";e.Material._materialCache.addMaterial(e.Material.CircleFadeType,{fabric:{type:e.Material.CircleFadeType,uniforms:{color:new e.Color(1,0,0,.7),duration:45},source:we},translucent:function(t){return!0}});e.Material.CircleWaveType="CircleWave";e.Material._materialCache.addMaterial(e.Material.CircleWaveType,{fabric:{type:e.Material.CircleWaveType,uniforms:{color:new e.Color(1,0,0,.7),duration:45,count:1,gradient:.1},source:xe},translucent:function(t){return!0}});DC.PolylineTrailMaterialProperty=class{constructor(t){t=t||{},this._definitionChanged=new e.Event,this._color=void 0,this._colorSubscription=void 0,this._duration=void 0,this._durationSubscription=void 0,this.color=e.defaultValue(t.color,e.Color.fromBytes(0,255,255,255)),this.duration=e.defaultValue(t.duration,45)}get isConstant(){return!1}get definitionChanged(){return this._definitionChanged}getType(t){return e.Material.PolylineTrailType}getValue(t,i){return i||(i={}),i.color=e.Property.getValueOrClonedDefault(this._color,t,e.Color.WHITE,i.color),i.duration=this._duration,i}equals(t){return this===t||t instanceof DC.PolylineTrailMaterialProperty&&e.Property.equals(this._color,t._color)}};Object.defineProperties(DC.PolylineTrailMaterialProperty.prototype,{color:e.createPropertyDescriptor("color"),duration:e.createPropertyDescriptor("duration")});DC.PolylineFlowMaterialProperty=class{constructor(t){t=t||{},this._definitionChanged=new e.Event,this._color=void 0,this._colorSubscription=void 0,this.color=e.defaultValue(t.color,e.Color.fromBytes(0,255,255,255)),this._duration=void 0,this._durationSubscription=void 0,this.duration=e.defaultValue(t.duration,45)}get isConstant(){return!1}get definitionChanged(){return this._definitionChanged}getType(t){return e.Material.PolylineFlowType}getValue(t,i){return i||(i={}),i.color=e.Property.getValueOrClonedDefault(this._color,t,e.Color.WHITE,i.color),i.duration=this._duration,i}equals(t){return this===t||t instanceof DC.PolylineFlowMaterialProperty&&e.Property.equals(this._color,t._color)}};Object.defineProperties(DC.PolylineFlowMaterialProperty.prototype,{color:e.createPropertyDescriptor("color"),duration:e.createPropertyDescriptor("duration")});DC.PolylineEmissionMaterialProperty=class{constructor(t){t=t||{},this._definitionChanged=new e.Event,this._color=void 0,this._colorSubscription=void 0,this.color=e.defaultValue(t.color,new e.Color(1,0,0,.7))}get isConstant(){return!1}get definitionChanged(){return this._definitionChanged}getType(t){return e.Material.PolylineEmissionType}getValue(t,i){return i||(i={}),i.color=e.Property.getValueOrUndefined(this._color,t),i}equals(t){return this===t||t instanceof DC.PolylineEmissionMaterialProperty&&e.Property.equals(this._color,t._color)}};Object.defineProperties(DC.PolylineEmissionMaterialProperty.prototype,{color:e.createPropertyDescriptor("color")});DC.WaterMaterialProperty=class{constructor(t){t=t||{},this._definitionChanged=new e.Event,this._baseWaterColor=void 0,this._baseWaterColorSubscription=void 0,this.baseWaterColor=e.defaultValue(t.baseWaterColor,new e.Color(.2,.3,.6,1)),this._blendColor=void 0,this._blendColorSubscription=void 0,this.blendColor=e.defaultValue(t.blendColor,new e.Color(0,1,.699,1)),this._specularMap=void 0,this._specularMapSubscription=void 0,this.specularMap=e.defaultValue(t.specularMap,e.Material.DefaultImageId),this._normalMap=void 0,this._normalMapSubscription=void 0,this.normalMap=e.defaultValue(t.normalMap,e.Material.DefaultImageId),this.frequency=e.defaultValue(t.frequency,10),this.animationSpeed=e.defaultValue(t.animationSpeed,.01),this.amplitude=e.defaultValue(t.amplitude,1),this.specularIntensity=e.defaultValue(t.specularIntensity,.5),this.fadeFactor=e.defaultValue(t.fadeFactor,1)}get isConstant(){return!1}get definitionChanged(){return this._definitionChanged}getType(t){return e.Material.WaterType}getValue(t,i){return i||(i={}),i.baseWaterColor=e.Property.getValueOrUndefined(this._baseWaterColor,t),i.blendColor=e.Property.getValueOrUndefined(this._blendColor,t),i.specularMap=e.Property.getValueOrUndefined(this._specularMap,t),i.normalMap=e.Property.getValueOrUndefined(this._normalMap,t),i.frequency=this.frequency,i.animationSpeed=this.animationSpeed,i.amplitude=this.amplitude,i.specularIntensity=this.specularIntensity,i.fadeFactor=this.fadeFactor,i}equals(t){return this===t||t instanceof DC.WaterMaterialProperty&&e.Property.equals(this._baseWaterColor,t._baseWaterColor)}};Object.defineProperties(DC.WaterMaterialProperty.prototype,{baseWaterColor:e.createPropertyDescriptor("baseWaterColor"),blendColor:e.createPropertyDescriptor("blendColor"),specularMap:e.createPropertyDescriptor("specularMap"),normalMap:e.createPropertyDescriptor("normalMap")});DC.RimLightingMaterialProperty=class{constructor(t){t=t||{},this._definitionChanged=new e.Event,this._color=void 0,this._colorSubscription=void 0,this.color=e.defaultValue(t.color,new e.Color(1,0,0,.7)),this._rimColor=void 0,this._rimColorSubscription=void 0,this.rimColor=e.defaultValue(t.rimColor,new e.Color(1,1,1,.4)),this._width=void 0,this._widthSubscription=void 0,this.width=e.defaultValue(t.width,.3)}get isConstant(){return!1}get definitionChanged(){return this._definitionChanged}getType(t){return e.Material.RimLightingType}getValue(t,i){return i||(i={}),i.color=e.Property.getValueOrUndefined(this._color,t),i.rimColor=e.Property.getValueOrUndefined(this._rimColor,t),i.width=e.Property.getValueOrUndefined(this._width,t),i}equals(t){return this===t||t instanceof DC.RimLightingMaterialProperty&&e.Property.equals(this._color,t._color)}};Object.defineProperties(DC.RimLightingMaterialProperty.prototype,{color:e.createPropertyDescriptor("color"),rimColor:e.createPropertyDescriptor("rimColor"),width:e.createPropertyDescriptor("width")});DC.CircleFadeMaterialProperty=class{constructor(t){t=t||{},this._definitionChanged=new e.Event,this._color=void 0,this._colorSubscription=void 0,this._duration=void 0,this._durationSubscription=void 0,this.color=e.defaultValue(t.color,e.Color.fromBytes(0,255,255,255)),this.duration=e.defaultValue(t.duration,45)}get isConstant(){return!1}get definitionChanged(){return this._definitionChanged}getType(t){return e.Material.CircleFadeType}getValue(t,i){return i||(i={}),i.color=e.Property.getValueOrUndefined(this._color,t),i.duration=this._duration,i}equals(t){return this===t||t instanceof DC.CircleFadeMaterialProperty&&e.Property.equals(this._color,t._color)}};Object.defineProperties(DC.CircleFadeMaterialProperty.prototype,{color:e.createPropertyDescriptor("color"),duration:e.createPropertyDescriptor("duration")});DC.CircleWaveMaterialProperty=class{constructor(t){t=t||{},this._definitionChanged=new e.Event,this._color=void 0,this._colorSubscription=void 0,this._duration=void 0,this._durationSubscription=void 0,this.color=e.defaultValue(t.color,e.Color.fromBytes(0,255,255,255)),this.duration=e.defaultValue(t.duration,45),this.count=Math.max(e.defaultValue(t.count,2),1),this.gradient=e.defaultValue(t.gradient,.1),this.gradient<0?this.gradient=0:this.gradient>1&&(this.gradient=1)}get isConstant(){return!1}get definitionChanged(){return this._definitionChanged}getType(t){return e.Material.CircleWaveType}getValue(t,i){return i||(i={}),i.color=e.Property.getValueOrUndefined(this._color,t),i.duration=this._duration,i.count=this.count,i.gradient=this.gradient,i}equals(t){return this===t||t instanceof DC.CircleWaveMaterialProperty&&e.Property.equals(this._color,t._color)}};Object.defineProperties(DC.CircleWaveMaterialProperty.prototype,{color:e.createPropertyDescriptor("color"),duration:e.createPropertyDescriptor("duration")});class p{constructor(i){this._id=i||DC.Util.uuid(),this._viewer=void 0,this._delegate=void 0,this._state=void 0,this._effectEvent=new A,this.type=void 0,this.on(DC.EffectEventType.ADD,this._addCallback,this),this.on(DC.EffectEventType.REMOVE,this._removeCallback,this)}get id(){return this._id}get effectEvent(){return this._effectEvent}_prepareDelegate(){}_addCallback(i){this._viewer=i,this._prepareDelegate(),this._delegate&&this._viewer.delegate.scene.postProcessStages.add(this._delegate),this._state=DC.EffectState.ADDED}_removeCallback(){this._viewer,this._delegate&&(this._viewer.delegate.scene.postProcessStages.remove(this._delegate),this._delegate=void 0),this._state=DC.EffectState.REMOVED}addToViewer(i){return i.addEffect(this),this}on(i,r,a){return this._effectEvent.on(i,r,a||this),this}off(i,r,a){return this._effectEvent.off(i,r,a||this),this}fire(i,r){return this._effectEvent.fire(i,r),this}}DC.BloomEffect=class extends p{constructor(t){super(t),this._contrast=128,this._brightness=-.3,this._glowOnly=!1,this._delta=1,this._sigma=2,this._stepSize=1,this._state=DC.EffectState.INITIALIZED,this.type=DC.EffectType.BLOOM}set contrast(t){this._contrast=t,this._delegate&&(this._delegate.uniforms.contrast=this._contrast)}set brightness(t){this._brightness=t,this._delegate&&(this._delegate.uniforms.brightness=this._brightness)}set glowOnly(t){this._glowOnly=t,this._delegate&&(this._delegate.uniforms.glowOnly=this._glowOnly)}set delta(t){this._delta=t,this._delegate&&(this._delegate.uniforms.delta=this._delta)}set sigma(t){this._sigma=t,this._delegate&&(this._delegate.uniforms.sigma=this._sigma)}set stepSize(t){this._stepSize=t,this._delegate&&(this._delegate.uniforms.stepSize=this._stepSize)}_prepareDelegate(){this._delegate=this._viewer.delegate.scene.postProcessStages.bloom,this._delegate.uniforms.contrast=this._contrast,this._delegate.uniforms.brightness=this._brightness,this._delegate.uniforms.glowOnly=this._glowOnly,this._delegate.uniforms.delta=this._delta,this._delegate.uniforms.sigma=this._sigma,this._delegate.uniforms.stepSize=this._stepSize}_addCallback(t){this._viewer=t,this._prepareDelegate(),this._delegate&&(this._delegate.enabled=!0),this._state=DC.EffectState.ADDED}_removeCallback(){this._delegate&&(this._delegate.enabled=!1,this.delegate=void 0),this._state=DC.EffectState.REMOVED}};DC.EffectType.BLOOM="bloom";var De=`uniform sampler2D colorTexture;
uniform sampler2D depthTexture;
varying vec2 v_textureCoordinates;
uniform vec4 u_scanCenterEC;
uniform vec3 u_scanPlaneNormalEC;
uniform float u_radius;
uniform vec4 u_scanColor;

vec4 toEye(in vec2 uv, in float depth){
  vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));
  vec4 posInCamera = czm_inverseProjection * vec4(xy, depth, 1.0);
  posInCamera =posInCamera / posInCamera.w;
  return posInCamera;
}

vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point){
    vec3 v01 = point - planeOrigin;
    float d = dot(planeNormal, v01) ;
    return (point - planeNormal * d);
}

float getDepth(in vec4 depth){
    float z_window = czm_unpackDepth(depth);
    z_window = czm_reverseLogDepth(z_window);
    float n_range = czm_depthRange.near;
    float f_range = czm_depthRange.far;
    return (2.0 * z_window - n_range - f_range) / (f_range - n_range);
}

void main(){
    gl_FragColor = texture2D(colorTexture, v_textureCoordinates);
    float depth = getDepth(texture2D(depthTexture, v_textureCoordinates));
    vec4 viewPos = toEye(v_textureCoordinates, depth);
    vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz, u_scanCenterEC.xyz, viewPos.xyz);
    float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);
    if(dis < u_radius){
      float f = 1.0 - abs(u_radius - dis) / u_radius;
      f = pow(f, 4.0);
      gl_FragColor = mix(gl_FragColor, u_scanColor, f);
    }
  }`;let ze=De;DC.CircleScanEffect=class extends p{constructor(t,i,r,a,o){if(!i||!(i instanceof DC.Position))throw new Error("the position invalid");super(t),this._position=i,this._radius=r||0,this._color=e.defaultValue(a,e.Color.RED),this._duration=e.defaultValue(o,1)*1e3,this._state=DC.EffectState.INITIALIZED,this.type=DC.EffectType.CIRCLE_SCAN}_prepareDelegate(){let t=DC.T.transformWSG84ToCartesian(this._position),i=new e.Cartesian4(t.x,t.y,t.z,1),r=DC.T.transformWSG84ToCartesian(new DC.Position(this._position.lng,this._position.lat,this._position.alt+500)),a=new e.Cartesian4(r.x,r.y,r.z,1),o=new Date().getTime();this._delegate=new e.PostProcessStage({name:this._id,fragmentShader:ze,uniforms:{u_scanCenterEC:()=>e.Matrix4.multiplyByVector(this._viewer.delegate.camera._viewMatrix,i,new e.Cartesian4),u_scanPlaneNormalEC:()=>{let s=e.Matrix4.multiplyByVector(this._viewer.delegate.camera._viewMatrix,i,new e.Cartesian4),_=e.Matrix4.multiplyByVector(this._viewer.delegate.camera._viewMatrix,a,new e.Cartesian4),c=new e.Cartesian3;return c.x=_.x-s.x,c.y=_.y-s.y,c.z=_.z-s.z,e.Cartesian3.normalize(c,c),c},u_radius:()=>this._radius*((new Date().getTime()-o)%this._duration)/this._duration,u_scanColor:this._color}})}};DC.EffectType.CIRCLE_SCAN="circleScan";var Te=`uniform sampler2D colorTexture;
uniform sampler2D depthTexture;
varying vec2 v_textureCoordinates;
uniform vec4 u_scanCenterEC;
uniform vec3 u_scanPlaneNormalEC;
uniform vec3 u_scanLineNormalEC;
uniform float u_radius;
uniform vec4 u_scanColor;

vec4 toEye(in vec2 uv, in float depth){
  vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));
  vec4 posInCamera =czm_inverseProjection * vec4(xy, depth, 1.0);
  posInCamera =posInCamera / posInCamera.w;
  return posInCamera;
}

bool isPointOnLineRight(in vec3 ptOnLine, in vec3 lineNormal, in vec3 testPt){
  vec3 v01 = testPt - ptOnLine;
  normalize(v01);
  vec3 temp = cross(v01, lineNormal);
  float d = dot(temp, u_scanPlaneNormalEC);
  return d > 0.5;
}

vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point){
  vec3 v01 = point -planeOrigin;
  float d = dot(planeNormal, v01) ;
  return (point - planeNormal * d);
}

float distancePointToLine(in vec3 ptOnLine, in vec3 lineNormal, in vec3 testPt){
  vec3 tempPt = pointProjectOnPlane(lineNormal, ptOnLine, testPt);
  return length(tempPt - ptOnLine);
}

float getDepth(in vec4 depth){
  float z_window = czm_unpackDepth(depth);
  z_window = czm_reverseLogDepth(z_window);
  float n_range = czm_depthRange.near;
  float f_range = czm_depthRange.far;
  return (2.0 * z_window - n_range - f_range) / (f_range - n_range);
}

void main(){
  gl_FragColor = texture2D(colorTexture, v_textureCoordinates);
  float depth = getDepth( texture2D(depthTexture, v_textureCoordinates));
  vec4 viewPos = toEye(v_textureCoordinates, depth);
  vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz, u_scanCenterEC.xyz, viewPos.xyz);
  float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);
  float twou_radius = u_radius * 2.0;
  if(dis < u_radius){
      float f0 = 1.0 -abs(u_radius - dis) / u_radius;
      f0 = pow(f0, 64.0);
      vec3 lineEndPt = vec3(u_scanCenterEC.xyz) + u_scanLineNormalEC * u_radius;
      float f = 0.0;
      if(isPointOnLineRight(u_scanCenterEC.xyz, u_scanLineNormalEC.xyz, prjOnPlane.xyz)){
          float dis1= length(prjOnPlane.xyz - lineEndPt);
          f = abs(twou_radius -dis1) / twou_radius;
          f = pow(f, 3.0);
      }
      gl_FragColor = mix(gl_FragColor, u_scanColor, f + f0);
    }
}`;let Ee=Te;DC.RadarScanEffect=class extends p{constructor(t,i,r,a,o){if(!i||!(i instanceof DC.Position))throw new Error("the position invalid");super(t),this._position=i,this._radius=r||0,this._color=e.defaultValue(a,e.Color.RED),this._duration=e.defaultValue(o,1)*1e3,this._state=DC.EffectState.INITIALIZED,this.type=DC.EffectType.RADAR_SCAN}_prepareDelegate(){let t=DC.T.transformWSG84ToCartesian(this._position),i=new e.Cartesian4(t.x,t.y,t.z,1),r=DC.T.transformWSG84ToCartesian(new DC.Position(this._position.lng,this._position.lat,this._position.alt+500)),a=new e.Cartesian4(r.x,r.y,r.z,1),o=DC.T.transformWSG84ToCartesian(new DC.Position(this._position.lng+.001,this._position.lat,this._position.alt)),s=new e.Cartesian4(o.x,o.y,o.z,1),_=new Date().getTime(),c=new e.Quaternion,C=new e.Matrix3,y=new e.Cartesian4,g=new e.Cartesian4,M=new e.Cartesian4,l=new e.Cartesian3,h=new e.Cartesian3;this._delegate=new e.PostProcessStage({name:this._id,fragmentShader:Ee,uniforms:{u_scanCenterEC:()=>e.Matrix4.multiplyByVector(this._viewer.delegate.camera._viewMatrix,i,y),u_scanPlaneNormalEC:()=>{let n=e.Matrix4.multiplyByVector(this._viewer.delegate.camera._viewMatrix,i,y),d=e.Matrix4.multiplyByVector(this._viewer.delegate.camera._viewMatrix,a,g);return l.x=d.x-n.x,l.y=d.y-n.y,l.z=d.z-n.z,e.Cartesian3.normalize(l,l),l},u_scanLineNormalEC:()=>{let n=e.Matrix4.multiplyByVector(this._viewer.delegate.camera._viewMatrix,i,y),d=e.Matrix4.multiplyByVector(this._viewer.delegate.camera._viewMatrix,a,g),f=e.Matrix4.multiplyByVector(viewer.camera._viewMatrix,s,M);l.x=d.x-n.x,l.y=d.y-n.y,l.z=d.z-n.z,e.Cartesian3.normalize(l,l),h.x=f.x-n.x,h.y=f.y-n.y,h.z=f.z-n.z;let b=(new Date().getTime()-_)%this._duration/this._duration;return e.Quaternion.fromAxisAngle(l,b*e.Math.PI*2,c),e.Matrix3.fromQuaternion(c,C),e.Matrix3.multiplyByVector(C,h,h),e.Cartesian3.normalize(h,h),h},u_radius:this._radius,u_scanColor:this._color}})}};DC.EffectType.RADAR_SCAN="radarScan";var Me=`uniform sampler2D colorTexture;
uniform sampler2D depthTexture;
uniform float trength;
uniform vec4 fogcolor;
varying vec2 v_textureCoordinates;

void main(void){
  vec4 origcolor = texture2D(colorTexture, v_textureCoordinates);
  vec4 depthcolor = texture2D(depthTexture, v_textureCoordinates);
  float f= clamp( trength * (depthcolor.r - 0.3 ) / 0.2, 0.0, 1.0);
  gl_FragColor = mix(origcolor,fogcolor,f);
}`;let be=Me;DC.FogEffect=class extends p{constructor(t,i,r=1){super(t),this._trength=r||1,this._color=i||new e.Color(.8,.8,.8,.5),this._state=DC.EffectState.INITIALIZED,this.type=DC.EffectType.FOG}_prepareDelegate(){let t=this;this._delegate=new e.PostProcessStage({name:this._id,fragmentShader:be,uniforms:{trength:()=>t._trength,fogcolor:()=>t._color}})}};DC.EffectType.FOG="fog";var Pe=`uniform sampler2D colorTexture;
varying vec2 v_textureCoordinates;

float snow(vec2 uv,float scale){
    float time = czm_frameNumber / 60.0;
    float w=smoothstep(1.,0.,-uv.y*(scale/10.));
    if(w<.1)return 0.;
    uv+=time/scale;
    uv.y+=time*2./scale;
    uv.x+=sin(uv.y+time*.5)/scale;
    uv*=scale;
    vec2 s=floor(uv),f=fract(uv),p;
    float k=3.,d;
    p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*5.))-f;
    d=length(p);
    k=min(d,k);
    k=smoothstep(0.,k,sin(f.x+f.y)*0.01);
    return k*w;
}

void main(){
    vec2 resolution = czm_viewport.zw;
    vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);
    vec3 finalColor=vec3(0);
    float c = 0.0;
    c+=snow(uv,30.)*.0;
    c+=snow(uv,20.)*.0;
    c+=snow(uv,15.)*.0;
    c+=snow(uv,10.);
    c+=snow(uv,8.);
    c+=snow(uv,6.);
    c+=snow(uv,5.);
    finalColor=(vec3(c));
    gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(finalColor,1), 0.3);

}`;let Ae=Pe;DC.SnowEffect=class extends p{constructor(t){super(t),this._state=DC.EffectState.INITIALIZED,this.type=DC.EffectType.SNOW}_prepareDelegate(){this._delegate=new e.PostProcessStage({name:this._id,fragmentShader:Ae})}};DC.EffectType.SNOW="snow";var ke=`uniform sampler2D colorTexture;
varying vec2 v_textureCoordinates;

float hash(float x){
  return fract(sin(x*23.3)*13.13);
}

void main(){
    float time = czm_frameNumber / 60.0;
    vec2 resolution = czm_viewport.zw;
    vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);
    vec3 c=vec3(.6,.7,.8);
    float a=-.4;
    float si=sin(a),co=cos(a);
    uv*=mat2(co,-si,si,co);
    uv*=length(uv+vec2(0,4.9))*.3+1.;
    float v=1.-sin(hash(floor(uv.x*100.))*2.);
    float b=clamp(abs(sin(20.*time*v+uv.y*(5./(2.+v))))-.95,0.,1.)*20.;
    c*=v*b;
    gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(c,1), 0.5);
}`;let Ie=ke;DC.RainEffect=class extends p{constructor(t){super(t),this._state=DC.EffectState.INITIALIZED,this.type=DC.EffectType.RAIN}_prepareDelegate(){this._delegate=new e.PostProcessStage({name:this._id,fragmentShader:Ie})}};DC.EffectType.RAIN="rain";DC.CzmlLayer=class extends v{constructor(t,i,r={}){if(!i)throw new Error("the url is empty");super(t),this._delegate=e.CzmlDataSource.load(i,r),this._state=DC.LayerState.INITIALIZED,this.type=DC.LayerType.CZML}set show(t){this._show=t,this._delegate&&this._delegate.then(i=>{i.show=this._show})}get show(){return this._show}eachOverlay(t,i){if(this._delegate)return this._delegate.then(r=>{r.entities.values.forEach(a=>{t.call(i,a)})}),this}};DC.LayerType.CZML="czml";DC.KmlLayer=class extends v{constructor(t,i,r={}){if(!i)throw new Error("the url is empty");super(t),this._delegate=e.KmlDataSource.load(i,r),this._state=DC.LayerState.INITIALIZED,this.type=DC.LayerType.KML}set show(t){this._show=t,this._delegate&&this._delegate.then(i=>{i.show=this._show})}get show(){return this._show}eachOverlay(t,i){if(this._delegate)return this._delegate.then(r=>{r.entities.values.forEach(a=>{t.call(i,a)})}),this}};DC.LayerType.KML="kml";DC.HtmlLayer=class extends v{constructor(t){super(t),this._delegate=DC.DomUtil.create("div","html-layer"),this._delegate.setAttribute("id",this._id),this._state=DC.LayerState.INITIALIZED,this.type=DC.LayerType.HTML,this._renderCallback=void 0}set show(t){this._show=t,this._delegate.style.visibility=this._show?"visible":"hidden"}get show(){return this._show}_addCallback(t){this._viewer=t,this._viewer.dcContainer.appendChild(this._delegate);let i=this._viewer.scene;this._renderCallback=i.postRender.addEventListener(()=>{this.eachOverlay(r=>{if(r&&r.position){let a=e.SceneTransforms.wgs84ToWindowCoordinates(i,DC.T.transformWSG84ToCartesian(r.position));a&&r._updateWindowCoord(a)}})},this),this._state=DC.LayerState.ADDED}_removeCallback(){this._renderCallback(),this._viewer.dcContainer.removeChild(this._delegate),this._state=DC.LayerState.REMOVED}clear(){this._cache={};let t=this._delegate.childNodes;for(let i=t.length-1;i>=0;i--)this._delegate.removeChild(t[i]);return this._state=DC.LayerState.CLEARED,this}};DC.LayerType.HTML="html";const u=DC.getNamespace().mapv;DC.MapvDataSet=u?u.DataSet:void 0;DC.MapvLayer=class extends v{constructor(t,i={}){if(!u)throw new Error("miss mapv lib");super(t),this._option=i,this._dataSet=void 0,this._delegate=void 0,this.type=DC.LayerType.MAPV}set show(t){this._show=t,this._delegate&&(this._show?this._delegate.show():this._delegate.hide())}get show(){return this._show}_addCallback(t){this._viewer=t,this._delegate=new u.cesiumMapLayer(this._viewer.delegate,this._dataSet||new DC.MapvDataSet([]),this._option),t.delegate.scene.canvas.setAttribute("tabIndex",0),this._state=DC.LayerState.ADDED}_removeCallback(){this._delegate&&this._delegate.remove(),this._state=DC.LayerState.REMOVED}setDataSet(t){this._dataSet=t,this._delegate&&this._delegate.update({data:this._dataSet,option:this._option})}};DC.LayerType.MAPV="mapv";DC.CustomBillboard=class extends DC.Billboard{constructor(t,i){super(t,i),this._state=DC.OverlayState.INITIALIZED,this.type=DC.OverlayType.CUSTOM_BILLBOARD}setLine(t){if(this._position&&this._position.alt>0&&this._delegate){if(!this._delegate.polyline){let i=new DC.Position;this._delegate.polyline={positions:new e.CallbackProperty(r=>(i.lng=this._position.lng,i.lat=this._position.lat,i.alt=0,DC.T.transformWSG84ArrayToCartesianArray([i,this._position])))}}this._delegate.polyline&&this._delegate.polyline.merge(t)}return this}setCircle(t,i){return!this._delegate.ellipse&&(this._delegate.ellipse={}),this._delegate.ellipse.merge({semiMajorAxis:t,semiMinorAxis:t,...i}),this}};DC.OverlayType.CUSTOM_BILLBOARD="customBillboard";DC.CustomPolygon=class extends DC.Polygon{constructor(t){super(t),this._topOutline=void 0,this._bottomOutline=void 0,this._topOutline=new e.Entity({polyline:{positions:this._computePolylinePositions(0)},show:!1}),this._bottomOutline=new e.Entity({polyline:{positions:this._computePolylinePositions(0)},show:!1})}set show(t){this._show=t,this._delegate&&(this._delegate.show=t),this._topOutline&&(this._topOutline.show=t),this._bottomOutline&&(this._bottomOutline.show=t)}get show(){return this._show}_computePolylinePositions(t){let i=this._positions.slice(0);return i.push(i[0]),i.forEach(r=>{r.alt=t}),DC.T.transformWSG84ArrayToCartesianArray(i)}_addCallback(t){this._layer=t,this._prepareDelegate(),this._layer&&this._layer.delegate&&this._layer.delegate.entities&&(this._layer.delegate.entities.add(this._delegate),this._layer.delegate.entities.add(this._topOutline),this._layer.delegate.entities.add(this._bottomOutline),this._state=DC.OverlayState.ADDED)}_removeCallback(){this._layer&&this._layer.delegate&&this._layer.delegate.entities&&(this._layer.delegate.entities.remove(this._delegate),this._layer.delegate.entities.remove(this._topOutline),this._layer.delegate.entities.remove(this._bottomOutline),this._state=DC.OverlayState.REMOVED)}setExtrudedHeight(t,i=0){return this._delegate.polygon&&(this._delegate.polygon.extrudedHeight=new e.CallbackProperty(r=>t),this._topOutline&&this._topOutline.show&&(this._topOutline.polyline.positions=new e.CallbackProperty(r=>this._computePolylinePositions(t)))),this}setTopOutline(t){if(this._topOutline){if(this._topOutline.show=e.defaultValue(t.show,!0),delete t.show,!t||Object.keys(t).length===0)return this;DC.Util.merge(this._topOutline.polyline,t)}return this}setBottomOutline(t){if(this._bottomOutline){if(this._bottomOutline.show=e.defaultValue(t.show,!0),delete t.show,!t||Object.keys(t).length===0)return this;DC.Util.merge(this._bottomOutline.polyline,t)}return this}};DC.DivIcon=class extends z{constructor(t,i){if(!t||!(t instanceof DC.Position))throw new Error("the position invalid");super(),this._position=t,this._delegate=DC.DomUtil.create("div","div-icon"),this._delegate.setAttribute("id",this._id),this._delegate.style.position="absolute",this._delegate.style.top="0",this._delegate.style.left="0",i&&typeof i=="string"?this._delegate.innerHTML=i:i&&i instanceof Element&&this._delegate.appendChild(i),this._state=DC.OverlayState.INITIALIZED,this.type=DC.OverlayType.DIVICON}set show(t){this._show=t,this._delegate.style.visibility=this._show?"visible":"hidden"}get show(){return this._show}set position(t){this._position=t}get position(){return this._position}_updateWindowCoord(t){let i=t.x-this._delegate.offsetWidth/2,r=t.y-this._delegate.offsetHeight/2;this._delegate.style.transform=`translate3d(${Math.round(i)}px,${Math.round(r)}px, 0)`}_addCallback(t){this._layer=t,this._layer.delegate.appendChild(this._delegate),this._delegate.addEventListener("click",i=>{this._overlayEvent.fire(DC.MouseEventType.CLICK,{layer:t,overlay:this,position:DC.T.transformWSG84ToCartesian(this._position)})}),this._state=DC.OverlayState.ADDED}_removeCallback(){this._layer&&(this._layer.delegate.removeChild(this._delegate),this._overlayEvent(),this._state=DC.OverlayState.REMOVED)}addClass(t){return DC.DomUtil.addClass(this._delegate,t),this}};DC.OverlayType.DIVICON="divICon";DC.Wall=class extends z{constructor(t){if(!t||typeof t!="string"&&!Array.isArray(t))throw new Error("the positions invalid");super(),this._positions=[],this._preparePositions(t),this._delegate=new e.Entity,this._state=DC.OverlayState.INITIALIZED,this.type=DC.OverlayType.WALL}set positions(t){this._preparePositions(t)}get positions(){return this._positions}_preparePositions(t){if(typeof t=="string"){if(t.indexOf("#")>=0)throw new Error("the positions invalid");t=t.split(";")}this._positions=t.map(i=>Array.isArray(i)?DC.Position.fromCoordArray(i):i instanceof DC.Position?i:DC.Position.fromCoordString(i))}_prepareDelegate(){this._delegate.wall={...this._style,positions:new e.CallbackProperty(t=>DC.T.transformWSG84ArrayToCartesianArray(this._positions))},this._delegate.layer=this._layer,this._delegate.overlayId=this._id}setStyle(t){return Object.keys(t).length==0?this:(this._style=t,this._delegate.wall&&DC.Util.merge(this._delegate.wall,this._style),this)}};DC.OverlayType.WALL="wall";
