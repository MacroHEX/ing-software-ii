-- CreateTable
CREATE TABLE "Rol" (
    "rolid" SERIAL NOT NULL,
    "nombrerol" TEXT NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("rolid")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "usuarioid" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "nombreusuario" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rolid" INTEGER NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("usuarioid")
);

-- CreateTable
CREATE TABLE "TipoEvento" (
    "tipoeventoid" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "TipoEvento_pkey" PRIMARY KEY ("tipoeventoid")
);

-- CreateTable
CREATE TABLE "Evento" (
    "eventoid" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "tipoeventoid" INTEGER NOT NULL,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("eventoid")
);

-- CreateTable
CREATE TABLE "Inscripcion" (
    "inscripcionid" SERIAL NOT NULL,
    "usuarioid" INTEGER NOT NULL,
    "eventoid" INTEGER NOT NULL,
    "fechainscripcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inscripcion_pkey" PRIMARY KEY ("inscripcionid")
);

-- CreateTable
CREATE TABLE "Organizador" (
    "organizadorid" SERIAL NOT NULL,
    "usuarioid" INTEGER NOT NULL,
    "eventoid" INTEGER NOT NULL,

    CONSTRAINT "Organizador_pkey" PRIMARY KEY ("organizadorid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_nombreusuario_key" ON "Usuario"("nombreusuario");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Organizador_usuarioid_eventoid_key" ON "Organizador"("usuarioid", "eventoid");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_rolid_fkey" FOREIGN KEY ("rolid") REFERENCES "Rol"("rolid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_tipoeventoid_fkey" FOREIGN KEY ("tipoeventoid") REFERENCES "TipoEvento"("tipoeventoid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_usuarioid_fkey" FOREIGN KEY ("usuarioid") REFERENCES "Usuario"("usuarioid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_eventoid_fkey" FOREIGN KEY ("eventoid") REFERENCES "Evento"("eventoid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organizador" ADD CONSTRAINT "Organizador_usuarioid_fkey" FOREIGN KEY ("usuarioid") REFERENCES "Usuario"("usuarioid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organizador" ADD CONSTRAINT "Organizador_eventoid_fkey" FOREIGN KEY ("eventoid") REFERENCES "Evento"("eventoid") ON DELETE RESTRICT ON UPDATE CASCADE;
