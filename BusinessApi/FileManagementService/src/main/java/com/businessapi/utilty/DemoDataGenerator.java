package com.businessapi.utilty;

import com.businessapi.dto.request.SaveFileRequestDemoDTO;
import com.businessapi.service.FileService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Service;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

@RequiredArgsConstructor
@Service
public class DemoDataGenerator {
    private final FileService fileService;

    @PostConstruct
    public void generateDemoData() {
        uploadExampleFile("C:\\Users\\guner\\Desktop\\demo.xlsx");
    }



    public void uploadExampleFile(String filePath) {
        // filePath doğrudan atanmalı, fazladan kaçış karakteri olmamalı
        filePath = "C:\\Users\\guner\\Desktop\\demo.xlsx";  // Dosya yolunu düzeltin

        try {
            // Dosyayı bilgisayarınızdan okuyun ve MultipartFile'e çevirin
            FileInputStream inputFile = new FileInputStream(filePath);
            MockMultipartFile multipartFile = new MockMultipartFile("file", "demo.xlsx", "EXCEL_XLSX", inputFile);

            // DTO oluşturun ve gerekli verileri doldurun
            SaveFileRequestDemoDTO dto = new SaveFileRequestDemoDTO(
                    "EXCEL_XLSX",
                    multipartFile
            );

            // Demo datayı yükleyin
            String result = fileService.saveDemoData(dto);
            System.out.println("Demo data yükleme başarılı, uuid: " + result);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }




}
