package com.backend.app.finanza.controller;

import java.io.ByteArrayOutputStream;
import java.time.YearMonth;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.app.finanza.model.dto.LibroIvaArchivos;
import com.backend.app.finanza.service.LibroIvaService;

@RestController
@RequestMapping("/api/iva")
public class LibroIvaController {

    private final LibroIvaService service;

    public LibroIvaController(LibroIvaService service) {
        this.service = service;
    }

    @GetMapping("/libro")
    public ResponseEntity<byte[]> generar(@RequestParam YearMonth periodo) throws Exception {
    
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

    @GetMapping("/percepciones")
    public ResponseEntity<byte[]> percepciones(@RequestParam YearMonth periodo) throws Exception {
    
        String txt = service.generarPercepciones(periodo);
    
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=percepciones_" + periodo + ".txt")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(txt.getBytes());
    }
}