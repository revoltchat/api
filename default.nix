{
  pkgs ? import <nixpkgs> { },
}:

pkgs.mkShell rec {
  buildInputs = [
    pkgs.nodejs
    pkgs.corepack
  ];
}
