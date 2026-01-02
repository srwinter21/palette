{ pkgs, ... }: {
  channel = "stable-24.11"; 

  packages = [
    pkgs.nodejs_20
    pkgs.typescript
    pkgs.nodePackages.typescript-language-server
  ];

  idx = {
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--host" "0.0.0.0"];
          manager = "web";
        };
      };
    };
  };
}