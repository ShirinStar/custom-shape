uniform float uTime;
uniform float uSpeed;
uniform float uStep;

varying vec3 vPosition;


void main() {
  //scaling the uv positions
  vec4 newUv = 0.5 - vec4(vPosition.xy * 0.15 * uStep, vPosition.y * 0.01, 1.0);
  
  //testing b&w
  vec4 blackWhiteUv = vec4(newUv.x, newUv.x, newUv.x, 1.0);
  
  //curves
  //float elevation = sin(vPosition.x * vPosition.y + uTime * uSpeed +uStep);
  
  //spikes
  //float teeth = step(0.8, strength + vPosition.y);

  //creating the stripes shape on x and y
  float strength = mod(newUv.y * 10.0 + newUv.x * 10.0 + uTime * uSpeed, 1.0);
  strength = step(0.8, strength);
   
  gl_FragColor = vec4(vec3(strength), 1.0);
}