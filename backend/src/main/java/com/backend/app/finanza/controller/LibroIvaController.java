package com.backend.app.finanza.controller;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.app.autentificacion.config.dto.IvaRequest;
import com.backend.app.finanza.model.dto.LibroIvaArchivos;
import com.backend.app.finanza.service.LibroIvaService;

@RestController
@RequestMapping("/iva")
public class LibroIvaController {

    private final LibroIvaService service;

    public LibroIvaController(LibroIvaService service) {
        this.service = service;
    }

    @PostMapping("/libro")
    public ResponseEntity<byte[]> generar(@RequestBody IvaRequest request) throws Exception {
    
        String periodo = request.periodo().format(DateTimeFormatter.ofPattern("yyyyMM"));
    
        LibroIvaArchivos result = service.generarArchivos();
    
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ZipOutputStream zip = new ZipOutputStream(baos);
    
        zip.putNextEntry(new ZipEntry("LIBRO_IVA_DIGITAL_VENTAS_CBTE_" + periodo + ".txt"));
        zip.write(result.ventasCbte().getBytes());
        zip.closeEntry();
    
        zip.putNextEntry(new ZipEntry("LIBRO_IVA_DIGITAL_VENTAS_ALICUOTAS_" + periodo + ".txt"));
        zip.write(result.ventasAlicuotas().getBytes());
        zip.closeEntry();
    
        zip.putNextEntry(new ZipEntry("LIBRO_IVA_DIGITAL_COMPRAS_CBTE_" + periodo + ".txt"));
        zip.write(result.comprasCbte().getBytes());
        zip.closeEntry();
    
        zip.putNextEntry(new ZipEntry("LIBRO_IVA_DIGITAL_COMPRAS_ALICUOTAS_" + periodo + ".txt"));
        zip.write(result.comprasAlicuotas().getBytes());
        zip.closeEntry();
    
        zip.close();
    
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=iva_libro_" + periodo + ".zip")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(baos.toByteArray());
    }

    @PostMapping("/percepciones")
    public ResponseEntity<byte[]> percepciones(@RequestBody IvaRequest request) throws Exception {
    
        String periodo = request.periodo()
                .format(DateTimeFormatter.ofPattern("yyyyMM"));
    
        String txt = service.generarPercepciones(request.periodo());
    
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=percepciones_" + periodo + ".txt")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(txt.getBytes());
    }
}