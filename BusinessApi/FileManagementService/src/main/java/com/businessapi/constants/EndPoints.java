package com.businessapi.constants;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

public class EndPoints {
    private static final String VERSION = "/v1";
    private static final String DEV = "/dev";



    private static final String ROOT = DEV + VERSION;

    public static final String FILE = ROOT + "/file";

    public static final String SAVE = "/save";
    public static final String UPDATE = "/update";
    public static final String DELETE = "/delete";
    public static final String GET = "/get";
    public static final String UPLOADPROFILEIMAGE = "/uploadProfileImage";
    public static final String GETPROFILEIMAGE = "/getProfileImage";




}
