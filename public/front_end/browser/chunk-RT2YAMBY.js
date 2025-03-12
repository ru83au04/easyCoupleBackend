import{a,b as o,c,e as l}from"./chunk-Y2NSYKDS.js";import{Y as n,ba as u,i,m as p}from"./chunk-55BIBHTM.js";var m=class r{constructor(e){this.http=e}rootUrl=l.rootURL;checkUser(e,t){let s=new o().set("username",e).set("password",t);return this.http.get(`${this.rootUrl}/api/user/check`,{params:s})}registUser(e){let t={username:e.username,password:e.password,name:e.real_name,emergency:e.emergency,address:e.address,start_date:e.start_date.toString(),role_id:e.role_id,department_id:e.department_id,phone:e.phone,emergency_phone:e.emergency_phone};return this.http.post(`${this.rootUrl}/api/user/register`,t)}loginUser(e,t){let s={username:e,password:t};return this.http.post(`${this.rootUrl}/api/user/login`,s)}logoutUser(){sessionStorage.removeItem("easy_couple_token")}getUserInfo(){let e=sessionStorage.getItem("easy_couple_token");if(!e)return new i;let t=new a().set("Authorization",`Bearer ${e}`);return this.http.get(`${this.rootUrl}/api/user/info`,{headers:t})}editUserInfo(e){let t=sessionStorage.getItem("easy_couple_token");if(!t)return new i;let s=new a().set("Authorization",`Bearer ${t}`);return this.http.post(`${this.rootUrl}/api/user/edit`,e,{headers:s})}deleteUser(e,t){let s=new a().set("Authorization",`Bearer ${e}`),g=new o().set("id",t);return this.http.get(`${this.rootUrl}/api/user/delete`,{headers:s,params:g})}static \u0275fac=function(t){return new(t||r)(u(c))};static \u0275prov=n({token:r,factory:r.\u0275fac,providedIn:"root"})};var d=class r{user={id:0,username:"",real_name:"",phone:"",emergency:"",emergency_phone:"",address:"",start_date:new Date,special_date:0,special_date_delay:0,role:"",department:""};currentUserSubject=new p(this.user);currentUser$=this.currentUserSubject.asObservable();constructor(){}loginUser(e){this.currentUserSubject.next(e)}logoutUser(){this.currentUserSubject.next(this.user)}refreshUser(e){this.currentUserSubject.next(e)}getRole(e){switch(e){case 1:return"\u4E3B\u7BA1";case 2:return"\u8077\u54E1";default:return"\u672A\u77E5"}}getDepartment(e){switch(e){case 1:return"\u5F8C\u7AEF";case 2:return"\u524D\u7AEF";default:return"\u672A\u77E5"}}static \u0275fac=function(t){return new(t||r)};static \u0275prov=n({token:r,factory:r.\u0275fac,providedIn:"root"})},b=(t=>(t[t.MANAGER=1]="MANAGER",t[t.EMPLOYEE=2]="EMPLOYEE",t))(b||{}),U=(t=>(t[t.BACKEND=1]="BACKEND",t[t.FRONTEND=2]="FRONTEND",t))(U||{});export{m as a,d as b,b as c,U as d};
