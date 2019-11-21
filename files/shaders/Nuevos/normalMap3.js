
class normalmap3 {

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

        this.u_ppuntual = this.gl.getUniformLocation(this.shader_program,'ppuntual');
        this.u_ipuntual = this.gl.getUniformLocation(this.shader_program,'ipuntual');
        this.u_fapuntual = this.gl.getUniformLocation(this.shader_program,"fapuntual");

        this.u_idireccional = this.gl.getUniformLocation(this.shader_program,'idireccional');
        this.u_ddireccional = this.gl.getUniformLocation(this.shader_program,'ddireccional');


        this.u_colorbase = this.gl.getUniformLocation(this.shader_program,"colorbase");
        this.u_oxido = this.gl.getUniformLocation(this.shader_program,"oxido");
        this.u_normalsmap = this.gl.getUniformLocation(this.shader_program,"normalsmap");
        this.u_metallic = this.gl.getUniformLocation(this.shader_program,"metallic");

        this.u_texturas_seleccionadas = this.gl.getUniformLocation(this.shader_program,"tex_selec");
      
    }

    set_luz(ambiente, spot, puntual, direccional) {
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
        uniform vec3 ddireccional;
        
        in vec3 vertexNormal;
        in vec3 vertexPosition;
        in vec2 vertexTextureCoordinates;
        
        out vec3 normal;
        out vec3 Lpuntual;
        out vec3 ojo;
        out vec3 Lspot;
        out vec3 LEspot;
        out vec3 ddir;
        out vec2 ftextCoord;
		out mat3 TBNMatrix;
        
        void main() {
            vec3 vPE = vec3(viewMatrix * modelMatrix * vec4(vertexPosition, 1));
            vec3 LE = vec3(viewMatrix * vec4(ppuntual,1));
            ddir = normalize( vec3( viewMatrix * vec4(ddireccional,0)));
            Lpuntual = normalize(vec3(LE-vPE));
            normal = normalize(vec3(normalMatrix*vec4(vertexNormal,0)));
            ojo = normalize(-vPE);  // distancia entre la posicion del ojo (0,0,0) y un vertice del objeto
            ftextCoord = vertexTextureCoordinates;
        
            
            vec3 tangent = normalize(vec3(normalMatrix*vec4(0,1,0,0)));
            //tangent = normalize(cross(normal,tangent));
            vec3 bitangent = normalize(cross(normal,tangent));
            TBNMatrix = mat3(tangent,bitangent,normal);
        
            LEspot = vec3(viewMatrix * vec4(pspot,1));
            Lspot = normalize( pspot - vec3(modelMatrix * vec4(vertexPosition, 1)) );
            LEspot = normalize(vec3(LEspot-vPE));
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
        uniform vec3 idireccional;
        uniform sampler2D colorbase;
		uniform sampler2D oxido;
        uniform sampler2D metallic;
        uniform sampler2D normalsmap;
        uniform vec4 tex_selec;

        in vec2 ftextCoord;
        in vec3 Lspot;
        in vec3 LEspot;
        in vec3 normal;
        in vec3 Lpuntual;
        in vec3 ojo;
        in vec3 ddir;
		in mat3 TBNMatrix;
        
        out vec4 fragmentColor;
        
        void main() {
        
        vec3 tex_base;
        if(tex_selec.x>0.0)  tex_base = vec3(texture(colorbase, ftextCoord));
        else tex_base = vec3(1,1,1);
       
        vec3 tex_oxido;
        if(tex_selec.y>0.0) tex_oxido = vec3(texture(oxido, ftextCoord));
        else tex_oxido = vec3(1,1,1);
        
        vec3 tex_difusa = tex_base * tex_oxido;

        vec3 tex_espec;
        if(tex_selec.w>0.0)  tex_espec = vec3(texture(metallic, ftextCoord));
        else tex_espec= vec3(1,1,1);
        

        vec3 normaltex = vec3(texture(normalsmap, ftextCoord));
        vec3 N;
        if(tex_selec.z>0.0) N = TBNMatrix * (normaltex * 2.0 - 1.0);
        else N = normalize(normal);

        float FP = 1.0/3.0;
        vec3 L = normalize(Lpuntual);
        vec3 V = normalize(ojo);
        vec3 H = normalize(L+V);
        float NL = max(dot(N,L),0.0);
        float NHn = pow(max(dot(N,H),0.0),n);
        float d = sqrt(L.x*L.x + L.y*L.y + L.z*L.z  );
        float fa = 1.0/(1.0+fapuntual.x+fapuntual.y*d+fapuntual.z*d*d);
            
        vec3 difusa = fa*ipuntual*tex_difusa*NL;
        vec3 especular = vec3(0,0,0);
        if(dot(N,L)>0.0){
         	especular += fa*ipuntual*tex_espec*NHn;
        }
    	vec3 ambiente = tex_difusa * intensidad_ambiente * 0.1;
        vec3 luzpuntual = ambiente + difusa + especular;
        
        vec3 Ldir = normalize(-ddir);
        NL = max(dot(N,Ldir),0.0);
        H = normalize(Ldir+V);
        NHn  = pow(max(dot(N,H),0.0),n);
        difusa = idireccional*tex_difusa*NL;
        especular = vec3(0,0,0);
        if(dot(N,Ldir)>0.0){
         	especular += tex_espec*idireccional*NHn;
        }
    	ambiente = tex_difusa * intensidad_ambiente * 0.1 ;
        vec3 luzdireccional = ambiente +  difusa + especular;
        
        vec3 Dspot = normalize(-dspot);
        vec3 vL = normalize(Lspot);
        L = normalize(LEspot);   
        H = normalize(L+V);
        NL = max(dot(N,L),0.0);
        NHn  = pow(max(dot(N,H),0.0),n);
        especular= vec3(0,0,0);
        vec3 luzspot;
        if ( angulo == 0.0 || dot(vL,Dspot) > angulo ) {
            d = sqrt(L.x*L.x + L.y*L.y + L.z*L.z);
            fa = 1.0/(1.0+faspot.x+faspot.y*d+faspot.z*d*d);
            difusa = fa*ispot*tex_difusa*NL;
            if(dot(N,L)>0.0){
                especular += fa*ispot*tex_espec*NHn;
            }
            ambiente = tex_difusa * intensidad_ambiente * 0.1;
            luzspot += ambiente + difusa + especular;
        }
        
        vec3 color = FP* ( luzspot + luzpuntual + luzdireccional) ;
        

        fragmentColor = vec4(color,1);
        }`;
    }

}
