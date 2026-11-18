import SwiftUI
import AVFoundation
import ScenicKit

/// The animated low-poly Tuscany island (design "Hero islands"): a muted, looping 36 s video
/// on a transparent-feeling paper ground. Calm, slow, and decorative only.
struct IslandView: View {
    var name = "isl-tuscany"

    var body: some View {
        LoopingVideo(name: name)
            .aspectRatio(1, contentMode: .fit)
            .accessibilityHidden(true)
    }
}

private struct LoopingVideo: UIViewRepresentable {
    let name: String

    func makeUIView(context: Context) -> PlayerView {
        let view = PlayerView()
        guard let url = Bundle.main.url(forResource: name, withExtension: "mp4") else { return view }
        let player = AVQueuePlayer()
        player.isMuted = true
        player.preventsDisplaySleepDuringVideoPlayback = false
        // Don't interrupt the driver's music or navigation audio.
        try? AVAudioSession.sharedInstance().setCategory(.ambient, options: [.mixWithOthers])
        view.looper = AVPlayerLooper(player: player, templateItem: AVPlayerItem(url: url))
        view.playerLayer.player = player
        view.playerLayer.videoGravity = .resizeAspect
        view.backgroundColor = .clear
        player.play()
        return view
    }

    func updateUIView(_ uiView: PlayerView, context: Context) {}

    final class PlayerView: UIView {
        var looper: AVPlayerLooper?
        override class var layerClass: AnyClass { AVPlayerLayer.self }
        var playerLayer: AVPlayerLayer { layer as! AVPlayerLayer }
    }
}

/// While roads are being found: the island floats, instead of a spinner.
struct PlanningOverlay: View {
    var body: some View {
        VStack(spacing: 4) {
            IslandView().frame(width: 160, height: 160)
            ProgressView().tint(Theme.green)
        }
        .padding(18)
        .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 24))
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("Finding beautiful roads")
    }
}
