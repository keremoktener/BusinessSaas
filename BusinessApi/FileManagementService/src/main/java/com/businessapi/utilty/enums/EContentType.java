package com.businessapi.utilty.enums;

public enum EContentType {
    IMAGE_JPEG("image/jpeg"),
    IMAGE_PNG("image/png"),
    APPLICATION_PDF("application/pdf"),
    EXCEL_XLSX("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");


    private final String contentType;

    EContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getContentType() {
        return contentType;
    }

    public static EContentType fromContentType(String contentType) {
        for (EContentType type : EContentType.values()) {
            if (type.getContentType().equals(contentType)) {
                return type;
            }
        }
        throw new IllegalArgumentException("No enum constant for content type: " + contentType);
    }
}


