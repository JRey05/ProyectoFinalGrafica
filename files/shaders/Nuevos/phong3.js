class Phong3 {

    constructor(gl) {
        this.gl = gl;

        this.shader_program = ShaderProgramHelper.create(this.vertex(), this.fragment());

        this.u_matriz_vista = this.gl.getUniformLocation(this.shader_program, 'viewMatrix');
        this.u_matriz_proyeccion = this.gl.getUniformLocation(this.shader_program, 'projectionMatrix');
        this.u_matriz_normal = this.gl.getUniformLocation(this.shader_program,'normalMatrix');
        this.u_matriz_modelo = this.gl.getUniformLocation(this.shader_program, 'modelMatrix');

        this.loc_normal = this.gl.getAttribLocation(this.shader_program, 'vertexNormal');
        this.loc_posicion = this.gl.getAttribLocation(this.shader_program, 'vertexPosition');
        this.loc_textura = this.gl.getAttribLocation(this.shader_program, 'vertexTextureCoordinates');

        this.u_intensidad_ambiente = this.gl.getUniformLocation(this.shader_program,"intensidad_ambiente");

        this.u_brillo = this.gl.getUniformLocation(this.shader_program,"n");

        this.u_pspot = this.gl.getUniformLocation(this.shader_program,'pspot');
        this.u_ispot = this.gl.getUniformLocation(this.shader_program,'ispot');
        this.u_faspot = this.gl.getUniformLocation(this.shader_program,'faspot');
        this.u_dspot = this.gl.getUniformLocation(this.shader_program,'dspot');
        this.u_angulo = this.gl.getUniformLocation(this.shader_program,'angulo');

        //spot2
        this.u_pspot2 = this.gl.getUniformLocation(this.shader_program,'pspot2');
        this.u_ispot2 = this.gl.getUniformLocation(this.shader_program,'ispot2');
        this.u_faspot2 = this.gl.getUniformLocation(this.shader_program,'faspot2');
        this.u_dspot2 = this.gl.getUniformLocation(this.shader_program,'dspot2');
        this.u_angulo2 = this.gl.getUniformLocation(this.shader_program,'angulo2');

        this.u_ppuntual = this.gl.getUniformLocation(this.shader_program,'ppuntual');
        this.u_ipuntual = this.gl.getUniformLocation(this.shader_program,'ipuntual');
        this.u_fapuntual = this.gl.getUniformLocation(this.shader_program,"fapuntual");

        this.u_idireccional = this.gl.getUniformLocation(this.shader_program,'idireccional');
        this.u_ddireccional = this.gl.getUniformLocation(this.shader_program,'ddireccional');


        this.u_imagen = this.gl.getUniformLocation(this.shader_program,"imagen");
    }

    set_luz(ambiente, spot, spot2, puntual, direccional) {
        this.gl.uniform3f(this.u_intensidad_ambiente , ambiente.intensidad[0], ambiente.intensidad[1], ambiente.intensidad[2]);

        // luz spot
        let posicion = spot.posicion;
        let intensidad = spot.intensidad;
        let atenuacion = spot.atenuacion;
        let direccion = spot.direccion;

        let angulo = spot.angulo;

        if ( angulo < -180 || angulo > 180 ) angulo = 180;
        angulo = Math.cos(Math.PI*angulo/180);

        this.gl.uniform3f(this.u_pspot, posicion[0], posicion[1], posicion[2]);
        this.gl.uniform3f(this.u_ispot, intensidad[0], intensidad[1], intensidad[2]);
        this.gl.uniform3f(this.u_faspot, atenuacion[0], atenuacion[1], atenuacion[2]);
        this.gl.uniform3f(this.u_dspot, direccion[0], direccion[1], direccion[2]);
        this.gl.uniform1f(this.u_angulo, angulo);

        // luz spot2
        let posicion2 = spot2.posicion;
        let intensidad2 = spot2.intensidad;
        let atenuacion2 = spot2.atenuacion;
        let direccion2 = spot2.direccion;

        let angulo2 = spot2.angulo;

        if ( angulo2 < -180 || angulo2 > 180 ) angulo2 = 180;
        angulo2 = Math.cos(Math.PI*angulo2/180);

        this.gl.uniform3f(this.u_pspot2, posicion2[0], posicion2[1], posicion2[2]);
        this.gl.uniform3f(this.u_ispot2, intensidad2[0], intensidad2[1], intensidad2[2]);
        this.gl.uniform3f(this.u_faspot2, atenuacion2[0], atenuacion2[1], atenuacion2[2]);
        this.gl.uniform3f(this.u_dspot2, direccion2[0], direccion2[1], direccion2[2]);
        this.gl.uniform1f(this.u_angulo2, angulo2);

        // luz puntual
        posicion = puntual.posicion;
        intensidad = puntual.intensidad;
        atenuacion = puntual.atenuacion;

        this.gl.uniform3f(this.u_ppuntual, posicion[0], posicion[1], posicion[2]);
        this.gl.uniform3f(this.u_ipuntual, intensidad[0], intensidad[1], intensidad[2]);
        this.gl.uniform3f(this.u_fapuntual, atenuacion[0], atenuacion[1], atenuacion[2]);

        // luz direccional
        intensidad = direccional.intensidad;
        direccion = direccional.direccion;

        this.gl.uniform3f(this.u_idireccional, intensidad[0], intensidad[1], intensidad[2]);
        this.gl.uniform3f(this.u_ddireccional, direccion[0], direccion[1], direccion[2]);
    }

    set_material(n) { this.gl.uniform1f(this.u_brillo,n); }

    vertex() {
        return `#version 300 es

        uniform mat4 viewMatrix;
        uniform mat4 projectionMatrix;
        uniform mat4 normalMatrix;
        uniform mat4 modelMatrix;
        
        uniform vec3 ppuntual;
        uniform vec3 pspot;
        uniform vec3 pspot2;
        uniform vec3 ddireccional;
        
        in vec3 vertexNormal;
        in vec3 vertexPosition;
        in vec2 vertexTextureCoordinates;
        
        out vec3 normal;
        out vec3 Lpuntual;
        out vec3 ojo;
        out vec3 Lspot;
        out vec3 LEspot;
        out vec3 Lspot2;
        out vec3 LEspot2;
        out vec3 ddir;
        out vec2 ftextCoord;
        
        void main() {
            vec3 vPE = vec3(viewMatrix * modelMatrix * vec4(vertexPosition, 1));
            vec3 LE = vec3(viewMatrix * vec4(ppuntual,1));
            ddir = normalize( vec3( viewMatrix * vec4(ddireccional,0)   )  );
            Lpuntual = normalize(vec3(LE-vPE));
            normal = normalize(vec3(normalMatrix*vec4(vertexNormal,1)));
            ojo = normalize(-vPE);  // distancia entre la posicion del ojo (0,0,0) y un vertice del objeto
            ftextCoord = vertexTextureCoordinates;
        
        
            LEspot = vec3(viewMatrix * vec4(pspot,1));
            Lspot = normalize( pspot - vec3(modelMatrix * vec4(vertexPosition, 1)) );
            LEspot = normalize(vec3(LEspot-vPE));
            LEspot2 = vec3(viewMatrix * vec4(pspot2,1));
            Lspot2 = normalize( pspot2 - vec3(modelMatrix * vec4(vertexPosition, 1)) );
            LEspot2 = normalize(vec3(LEspot2-vPE));
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertexPosition, 1);
        }
        `;
    }

    fragment() {
        return `#version 300 es
        precision mediump float;
        
        uniform vec3 intensidad_ambiente;
        
        uniform float n;
        
        uniform vec3 ipuntual;
        uniform vec3 fapuntual;
        
        uniform vec3 dspot;
        uniform vec3 ispot;
        uniform float angulo;
        uniform vec3 faspot;
        uniform vec3 dspot2;
        uniform vec3 ispot2;
        uniform float angulo2;
        uniform vec3 faspot2;
        uniform vec3 idireccional;
        uniform sampler2D imagen;
        
        in vec2 ftextCoord;
        in vec3 Lspot;
        in vec3 LEspot;
        in vec3 Lspot2;
        in vec3 LEspot2;
        in vec3 normal;
        in vec3 Lpuntual;
        in vec3 ojo;
        in vec3 ddir;
        
        out vec4 fragmentColor;
        
        void main() {

            vec3 difuso =  vec3(texture(imagen, ftextCoord));

            float FP = 1.0/3.0;
            vec3 N = normalize(normal);
            vec3 L = normalize(Lpuntual);
            vec3 V = normalize(ojo);
            vec3 H = normalize(L+V);
            float NL = max(dot(N,L),0.0); // intensidad de luz difusa
            float NHn = pow(max(dot(N,H),0.0),n);// intensidad de luz especular
            float d = sqrt(L.x*L.x + L.y*L.y + L.z*L.z  );
            float fa = 1.0/(1.0+fapuntual.x+fapuntual.y*d+fapuntual.z*d*d);
            vec3 luzpuntual = intensidad_ambiente*difuso + fa*ipuntual*(difuso*NL + NHn);
            
            
            vec3 Ldir = normalize(-ddir);
            NL = max(dot(N,Ldir),0.0);
            vec3 luzdireccional = vec3(0,0,0);
            H = normalize(Ldir+V);
            NHn  = pow(max(dot(N,H),0.0),n);
            luzdireccional =  intensidad_ambiente*difuso + idireccional*(difuso* NL + NHn  );   
            
            
            vec3 Dspot = normalize(-dspot);
            vec3 vL = normalize(Lspot);
            L = normalize(LEspot);   
            H = normalize(L+V);
            NL = max(dot(N,L),0.0);
            NHn  = pow(max(dot(N,H),0.0),n);
            vec3 luzspot = vec3(0,0,0);
            if ( angulo == 0.0 || dot(vL,Dspot) > angulo ) {
                d = sqrt(L.x*L.x + L.y*L.y + L.z*L.z  );
                fa = 1.0/(1.0+faspot.x+faspot.y*d+faspot.z*d*d);
                luzspot += intensidad_ambiente*difuso + fa*ispot*(difuso*NL*+NHn);
            }

            vec3 Dspot2 = normalize(-dspot2);
            vec3 vL2 = normalize(Lspot2);
            L = normalize(LEspot2);   
            H = normalize(L+V);
            NL = max(dot(N,L),0.0);
            NHn  = pow(max(dot(N,H),0.0),n);
            vec3 luzspot2 = vec3(0,0,0);
            if ( angulo2 == 0.0 || dot(vL2,Dspot2) > angulo2 ) {
                d = sqrt(L.x*L.x + L.y*L.y + L.z*L.z  );
                fa = 1.0/(1.0+faspot2.x+faspot2.y*d+faspot2.z*d*d);
                luzspot2 += intensidad_ambiente*difuso + fa*ispot2*(difuso*NL*+NHn);
            }
            
            vec3 color =  FP*( luzspot + luzspot2 + luzpuntual + luzdireccional) ;
            fragmentColor = vec4( color ,1);
        
        }`;
    }

}
