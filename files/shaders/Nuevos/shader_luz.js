class Shader_luz {

    constructor(gl) {
        this.gl = gl;

        this.shader_program = ShaderProgramHelper.create(this.vertex(), this.fragment());

        this.u_matriz_vista = this.gl.getUniformLocation(this.shader_program, 'viewMatrix');
        this.u_matriz_proyeccion = this.gl.getUniformLocation(this.shader_program, 'projectionMatrix');
        this.u_matriz_normal = this.gl.getUniformLocation(this.shader_program,'normalMatrix');
        this.u_matriz_modelo = this.gl.getUniformLocation(this.shader_program, 'modelMatrix');

        this.loc_normal = this.gl.getAttribLocation(this.shader_program, 'vertexNormal');
        this.loc_posicion = this.gl.getAttribLocation(this.shader_program, 'vertexPosition');

        this.u_intensidad_ambiente = this.gl.getUniformLocation(this.shader_program,"ia");

        this.u_constante_ambiente = this.gl.getUniformLocation(this.shader_program,"ka");
        this.u_constante_difusa = this.gl.getUniformLocation(this.shader_program,"kd");
        this.u_constante_especular = this.gl.getUniformLocation(this.shader_program,"ks");
        this.u_brillo = this.gl.getUniformLocation(this.shader_program,"n");

         //spot2
         this.u_pspot2 = this.gl.getUniformLocation(this.shader_program,'pspot2');
         this.u_ispot2 = this.gl.getUniformLocation(this.shader_program,'ispot2');
         this.u_faspot2 = this.gl.getUniformLocation(this.shader_program,'faspot2');
         this.u_dspot2 = this.gl.getUniformLocation(this.shader_program,'dspot2');
         this.u_angulo2 = this.gl.getUniformLocation(this.shader_program,'angulo2');

         //spot3
         this.u_pspot3 = this.gl.getUniformLocation(this.shader_program,'pspot3');
         this.u_ispot3 = this.gl.getUniformLocation(this.shader_program,'ispot3');
         this.u_faspot3 = this.gl.getUniformLocation(this.shader_program,'faspot3');
         this.u_dspot3 = this.gl.getUniformLocation(this.shader_program,'dspot3');
         this.u_angulo3 = this.gl.getUniformLocation(this.shader_program,'angulo3');

        this.u_ppuntual = this.gl.getUniformLocation(this.shader_program,'ppuntual');
        this.u_ipuntual = this.gl.getUniformLocation(this.shader_program,'ipuntual');
        this.u_fapuntual = this.gl.getUniformLocation(this.shader_program,"fapuntual");

        this.u_idireccional = this.gl.getUniformLocation(this.shader_program,'idireccional');
        this.u_ddireccional = this.gl.getUniformLocation(this.shader_program,'ddireccional');
    }

    set_luz(ambiente, spot2, spot3, puntual, direccional) {
        this.gl.uniform3f(this.u_intensidad_ambiente, ambiente.intensidad[0], ambiente.intensidad[1], ambiente.intensidad[2]);

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

        // luz spot3
        let posicion3 = spot3.posicion;
        let intensidad3 = spot3.intensidad;
        let atenuacion3 = spot3.atenuacion;
        let direccion3 = spot3.direccion;

        let angulo3 = spot3.angulo;

        if ( angulo3 < -180 || angulo3 > 180 ) angulo3 = 180;
        angulo3 = Math.cos(Math.PI*angulo3/180);

        this.gl.uniform3f(this.u_pspot3, posicion3[0], posicion3[1], posicion3[2]);
        this.gl.uniform3f(this.u_ispot3, intensidad3[0], intensidad3[1], intensidad3[2]);
        this.gl.uniform3f(this.u_faspot3, atenuacion3[0], atenuacion3[1], atenuacion3[2]);
        this.gl.uniform3f(this.u_dspot3, direccion3[0], direccion3[1], direccion3[2]);
        this.gl.uniform1f(this.u_angulo3, angulo3);

        // luz puntual
        let posicion = puntual.posicion;
        let intensidad = puntual.intensidad;
        let atenuacion = puntual.atenuacion;

        this.gl.uniform3f(this.u_ppuntual, posicion[0], posicion[1], posicion[2]);
        this.gl.uniform3f(this.u_ipuntual, intensidad[0], intensidad[1], intensidad[2]);
        this.gl.uniform3f(this.u_fapuntual, atenuacion[0], atenuacion[1], atenuacion[2]);

        // luz direccional
        intensidad = direccional.intensidad;
        let direccion = direccional.direccion;

        this.gl.uniform3f(this.u_idireccional, intensidad[0], intensidad[1], intensidad[2]);
        this.gl.uniform3f(this.u_ddireccional, direccion[0], direccion[1], direccion[2]);
    }

    set_material(material) {
        let ka = material.ka;
        let ks = material.ks;
        let kd = material.kd;
        let n = material.n;
        this.gl.uniform3f(this.u_constante_ambiente,ka[0],ka[1],ka[2]);
        this.gl.uniform3f(this.u_constante_difusa,kd[0],kd[1],kd[2]);
        this.gl.uniform3f(this.u_constante_especular,ks[0],ks[1],ks[2]);
        this.gl.uniform1f(this.u_brillo,n);
    }

    vertex() {
        return `#version 300 es

        uniform mat4 viewMatrix;
        uniform mat4 projectionMatrix;
        uniform mat4 normalMatrix;
        uniform mat4 modelMatrix;

        uniform vec3 ppuntual;
        uniform vec3 pspot2;
        uniform vec3 pspot3;
        uniform vec3 ddireccional;

        in vec3 vertexNormal;
        in vec3 vertexPosition;
        out vec3 normal;
        out vec3 Lpuntual;
        out vec3 ojo;
        out vec3 Lspot2;
        out vec3 LEspot2;
        out vec3 Lspot3;
        out vec3 LEspot3;
        out vec3 ddir;

        void main() {
            vec3 vPE = vec3(viewMatrix * modelMatrix * vec4(vertexPosition, 1));
            vec3 LE = vec3(viewMatrix * vec4(ppuntual,1));
            Lpuntual = normalize(vec3(LE-vPE));
            normal = normalize(vec3(normalMatrix*vec4(vertexNormal,1)));
            ojo = normalize(-vPE);  // distancia entre la posicion del ojo (0,0,0) y un vertice del objeto
            ddir = normalize( vec3(viewMatrix * vec4(ddireccional,0)) );

            LEspot2 = vec3(viewMatrix * vec4(pspot2,1));
            Lspot2 = normalize( pspot2 - vec3(modelMatrix * vec4(vertexPosition, 1)) );
            LEspot2 = normalize(vec3(LEspot2-vPE));
            LEspot3 = vec3(viewMatrix * vec4(pspot3,1));
            Lspot3 = normalize( pspot3 - vec3(modelMatrix * vec4(vertexPosition, 1)) );
            LEspot3 = normalize(vec3(LEspot3-vPE));
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertexPosition, 1);
        }
        `;
    }

    fragment() {
        return `#version 300 es
        precision mediump float;

        uniform vec3 ia;

        uniform vec3 ka;
        uniform vec3 kd;
        uniform vec3 ks;
        uniform float n;

        uniform vec3 ipuntual;
        uniform vec3 fapuntual;

        uniform vec3 dspot2;
        uniform vec3 ispot2;
        uniform float angulo2;
        uniform vec3 faspot2;
        uniform vec3 dspot3;
        uniform vec3 ispot3;
        uniform float angulo3;
        uniform vec3 faspot3;

        uniform vec3 idireccional;

        in vec3 Lspot2;
        in vec3 LEspot2;
        in vec3 Lspot3;
        in vec3 LEspot3;
        in vec3 normal;
        in vec3 Lpuntual;
        in vec3 ojo;
        in vec3 ddir;

        out vec4 fragmentColor;

        void main() {
            float FP = 1.0/3.0;
            vec3 N = normalize(normal);
            vec3 L = normalize(Lpuntual);
            vec3 V = normalize(ojo);
            vec3 H = normalize(L+V);
            float NL = max(dot(N,L),0.0); // intensidad de luz difusa
            float NHn = pow(max(dot(N,H),0.0),n);// intensidad de luz especular
            float d = sqrt(L.x*L.x + L.y*L.y + L.z*L.z  );
            float fa = 1.0/(1.0+fapuntual.x+fapuntual.y*d+fapuntual.z*d*d);
            vec3 luzpuntual = fa*ipuntual*(kd*NL + ks*NHn);


            vec3 Ldir = normalize(-ddir);
            NL = max(dot(N,Ldir),0.0);
            H = normalize(Ldir+V);
            NHn  = pow(max(dot(N,H),0.0),n);
            vec3 luzdireccional =  idireccional*( kd*NL);// + ks*NHn );

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
                luzspot2 += fa*ispot2*(kd*NL+ks*NHn);
            }

            vec3 Dspot3 = normalize(-dspot3);
            vec3 vL3 = normalize(Lspot3);
            L = normalize(LEspot3);   
            H = normalize(L+V);
            NL = max(dot(N,L),0.0);
            NHn  = pow(max(dot(N,H),0.0),n);
            vec3 luzspot3 = vec3(0,0,0);
            if ( angulo3 == 0.0 || dot(vL3,Dspot3) > angulo3 ) {
                d = sqrt(L.x*L.x + L.y*L.y + L.z*L.z  );
                fa = 1.0/(1.0+faspot3.x+faspot3.y*d+faspot3.z*d*d);
                luzspot3 += fa*ispot3*(kd*NL+ks*NHn);
            }

            vec3 color =  ia*ka + FP*(luzpuntual + luzspot2 + luzspot3 + luzdireccional) ;

            fragmentColor = vec4( color ,1);

        }
        `;
    }

}